// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract U2UBandwidthValidator is ReentrancyGuard, Ownable, Pausable {
    struct Validator {
        address owner;
        string nodeId;
        uint256 stake;
        uint256 totalTests;
        uint256 accuracyScore;
        uint256 lastActivity;
        bool isActive;
        
        // Personal Stats
        uint256 totalEarnings;
        uint256 avgUploadSpeed;
        uint256 avgDownloadSpeed;
        uint256 avgLatency;
        uint256 uptime;
        uint256 nodeRank;
        
        // Referral System
        address referrer;
        uint256 totalReferrals;
        uint256 referralEarnings;
        uint256 boostPercentage;
    }
    
    mapping(string => Validator) public validators;
    mapping(address => string) public addressToNodeId;
    mapping(address => uint256) public earnings;
    mapping(string => string[]) public referralTree;
    
    uint256 public constant MIN_STAKE = 50 * 10**18; // 50 U2U tokens
    uint256 public constant BASE_REWARD = 1 * 10**18; // 1 U2U per test
    uint256 public constant REFERRAL_BONUS_PERCENT = 10; // 10% referral bonus
    
    uint256[] public referralTiers = [1, 5, 10, 25, 50, 100];
    uint256[] public boostPercentages = [2, 5, 10, 15, 25, 50];
    
    event ValidatorRegistered(string indexed nodeId, address indexed owner, string referrerNodeId);
    event BandwidthTestCompleted(string indexed nodeId, uint256 reward);
    event ReferralRewardPaid(string indexed referrerNodeId, uint256 amount);
    event NodeStatsUpdated(string indexed nodeId, uint256 avgSpeed, uint256 uptime);
    event BoostUpdated(string indexed nodeId, uint256 newBoostPercentage);
    event EarningsClaimed(address indexed user, uint256 amount);
    event ValidatorDeactivated(string indexed nodeId);

    
    constructor() Ownable(msg.sender) {
        
    }

    modifier onlyActiveValidator(string memory nodeId) {
        require(validators[nodeId].isActive, "Validator inactive");
        require(validators[nodeId].owner == msg.sender, "Not validator owner");
        _;
    }

    function registerValidator(
        string memory nodeId, 
        string memory referrerNodeId
    ) external payable nonReentrant whenNotPaused {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(validators[nodeId].owner == address(0), "Already registered");
        require(bytes(nodeId).length > 0, "Invalid node ID");
        
        address referrerAddress = address(0);
        
        // Handle referrer logic
        if (bytes(referrerNodeId).length > 0) {
            require(validators[referrerNodeId].isActive, "Invalid referrer");
            require(keccak256(bytes(referrerNodeId)) != keccak256(bytes(nodeId)), "Cannot refer yourself");
            
            referrerAddress = validators[referrerNodeId].owner;
            
            // Update referrer stats
            validators[referrerNodeId].totalReferrals++;
            referralTree[referrerNodeId].push(nodeId);
            
            // Update referral boost
            _updateReferralBoost(referrerNodeId);
            
            // Pay referral bonus
            uint256 referralBonus = (msg.value * REFERRAL_BONUS_PERCENT) / 100;
            if (address(this).balance >= referralBonus) {
                payable(referrerAddress).transfer(referralBonus);
                validators[referrerNodeId].referralEarnings += referralBonus;
                
                emit ReferralRewardPaid(referrerNodeId, referralBonus);
            }
        }
        
        // Create new validator
        validators[nodeId] = Validator({
            owner: msg.sender,
            nodeId: nodeId,
            stake: msg.value,
            totalTests: 0,
            accuracyScore: 100,
            lastActivity: block.timestamp,
            isActive: true,
            totalEarnings: 0,
            avgUploadSpeed: 0,
            avgDownloadSpeed: 0,
            avgLatency: 0,
            uptime: 100,
            nodeRank: 0,
            referrer: referrerAddress,
            totalReferrals: 0,
            referralEarnings: 0,
            boostPercentage: 0
        });
        
        addressToNodeId[msg.sender] = nodeId;
        
        emit ValidatorRegistered(nodeId, msg.sender, referrerNodeId);
    }
    
    function submitBandwidthTest(
        string memory nodeId,
        uint256 uploadSpeed,
        uint256 downloadSpeed,
        uint256 latency,
        uint256 uptimePercentage,
        bytes32 proofHash
    ) external onlyActiveValidator(nodeId) nonReentrant whenNotPaused {
        require(uploadSpeed > 0 && downloadSpeed > 0, "Invalid speed values");
        require(latency > 0, "Invalid latency");
        require(uptimePercentage <= 100, "Invalid uptime percentage");
        require(proofHash != bytes32(0), "Invalid proof hash");
        
        Validator storage validator = validators[nodeId];
        
        // Update moving averages
        validator.avgUploadSpeed = _calculateMovingAverage(
            validator.avgUploadSpeed, 
            uploadSpeed, 
            validator.totalTests
        );
        validator.avgDownloadSpeed = _calculateMovingAverage(
            validator.avgDownloadSpeed, 
            downloadSpeed, 
            validator.totalTests
        );
        validator.avgLatency = _calculateMovingAverage(
            validator.avgLatency, 
            latency, 
            validator.totalTests
        );
        validator.uptime = _calculateMovingAverage(
            validator.uptime, 
            uptimePercentage, 
            validator.totalTests
        );
        
        // Calculate rewards
        uint256 baseReward = _calculateReward(uploadSpeed, downloadSpeed, latency);
        uint256 boostedReward = baseReward + (baseReward * validator.boostPercentage / 100);
        
        // Update validator stats
        validator.totalTests++;
        validator.totalEarnings += boostedReward;
        validator.lastActivity = block.timestamp;
        earnings[validator.owner] += boostedReward;
        
        // Update node rank
        _updateNodeRank(nodeId);
        
        emit NodeStatsUpdated(nodeId, (uploadSpeed + downloadSpeed) / 2, uptimePercentage);
        emit BandwidthTestCompleted(nodeId, boostedReward);
    }
    
    function _updateReferralBoost(string memory nodeId) internal {
        Validator storage validator = validators[nodeId];
        uint256 referralCount = validator.totalReferrals;
        
        uint256 newBoost = 0;
        for (uint256 i = referralTiers.length; i > 0; i--) {
            if (referralCount >= referralTiers[i-1]) {
                newBoost = boostPercentages[i-1];
                break;
            }
        }
        
        if (newBoost != validator.boostPercentage) {
            validator.boostPercentage = newBoost;
            emit BoostUpdated(nodeId, newBoost);
        }
    }
    
    function _updateNodeRank(string memory nodeId) internal {
        Validator storage validator = validators[nodeId];
        
        uint256 performanceScore = (validator.avgUploadSpeed + validator.avgDownloadSpeed) / 2;
        uint256 reliabilityScore = validator.uptime;
        uint256 activityScore = validator.totalTests;
        uint256 networkScore = validator.totalReferrals * 10;
        
        validator.nodeRank = (performanceScore * 40 + reliabilityScore * 30 + 
                            activityScore * 20 + networkScore * 10) / 100;
    }
    
    function _calculateMovingAverage(
        uint256 currentAvg, 
        uint256 newValue, 
        uint256 count
    ) internal pure returns (uint256) {
        if (count == 0) return newValue;
        return (currentAvg * count + newValue) / (count + 1);
    }
    
    function _calculateReward(
        uint256 upload,
        uint256 download, 
        uint256 latency
    ) internal pure returns (uint256) {
        uint256 speedScore = (upload + download) / 2;
        uint256 latencyPenalty = latency > 100 ? latency - 100 : 0;
        
        uint256 reward = BASE_REWARD + (speedScore * 10**15);
        uint256 penalty = latencyPenalty * 10**15;
        
        return reward > penalty ? reward - penalty : BASE_REWARD / 2;
    }
    
    function claimEarnings() external nonReentrant whenNotPaused {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "No earnings to claim");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit EarningsClaimed(msg.sender, amount);
    }
    
    function deactivateValidator(string memory nodeId) external onlyActiveValidator(nodeId) {
        validators[nodeId].isActive = false;
        
        emit ValidatorDeactivated(nodeId);
    }
    
    function getNodeStats(string memory nodeId) external view returns (
        uint256 totalTests,
        uint256 totalEarnings,
        uint256 avgUploadSpeed,
        uint256 avgDownloadSpeed,
        uint256 avgLatency,
        uint256 uptime,
        uint256 nodeRank,
        uint256 totalReferrals,
        uint256 boostPercentage
    ) {
        Validator memory validator = validators[nodeId];
        return (
            validator.totalTests,
            validator.totalEarnings,
            validator.avgUploadSpeed,
            validator.avgDownloadSpeed,
            validator.avgLatency,
            validator.uptime,
            validator.nodeRank,
            validator.totalReferrals,
            validator.boostPercentage
        );
    }
    
    function getReferralTree(string memory nodeId) external view returns (string[] memory) {
        return referralTree[nodeId];
    }
    
    function getValidatorByAddress(address owner) external view returns (string memory nodeId) {
        return addressToNodeId[owner];
    }
    
    function getTotalValidators() external pure returns (uint256) {
    return 0; // Placeholder
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function updateReferralTiers(
        uint256[] memory newTiers, 
        uint256[] memory newBoosts
    ) external onlyOwner {
        require(newTiers.length == newBoosts.length, "Arrays length mismatch");
        referralTiers = newTiers;
        boostPercentages = newBoosts;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Fallback function
    receive() external payable {}
    
    fallback() external payable {}
}
