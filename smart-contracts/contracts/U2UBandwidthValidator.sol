// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FluxBandNetwork is Ownable, ReentrancyGuard {
    
    // ===================== STATE VARIABLES =====================
    
    IERC20 public immutable u2uToken;
    IERC20 public immutable fluxToken;
    
    // ===================== STRUCTS =====================
    
    struct UserProfile {
        string username;
        string bio;
        string avatar;
        uint256 level;
        uint256 totalXP;
        uint256 joinTimestamp;
        uint256 totalEarnings;
        uint256 totalTests;
        uint256 successfulTests;
        uint256 referralCount;
        bool verified;
        bytes32[] achievements;
        uint256 globalRank;
        uint256 monthlyRank;
    }
    
    struct BandwidthTest {
        address validator;
        uint256 uploadSpeed;
        uint256 downloadSpeed;
        uint256 latency;
        uint256 timestamp;
        bytes32 proofHash;
        uint256 rewardAmount;
        bool verified;
    }
    
    struct ValidatorNode {
        string name;
        string location;
        string ipAddress;
        uint256 registrationTime;
        uint256 uptime;
        uint256 totalTests;
        uint256 successfulTests;
        uint256 totalEarnings;
        bool active;
        address owner;
    }
    
    struct ReferralData {
        address referrer;
        uint256 joinTimestamp;
        uint256 totalRewards;
        bool qualified;
        uint256 tier; // 0=Bronze, 1=Silver, 2=Gold, 3=Platinum, 4=Diamond
    }
    
    struct StakingInfo {
        uint256 stakedAmount;
        uint256 stakingTimestamp;
        uint256 lockEndTime;
        uint256 rewardsEarned;
        uint256 lastClaimTime;
        bool isStaking;
    }
    
    struct PendingReward {
        uint256 amount;
        uint256 timestamp;
        bytes32 proofHash;
        uint8 rewardType; // 0: bandwidth, 1: referral, 2: staking, 3: achievement, 4: daily
        bool claimed;
    }
    
    struct Achievement {
        string name;
        string description;
        uint256 xpReward;
        uint256 tokenReward;
        uint8 category; // 0: testing, 1: earnings, 2: social, 3: special
        uint8 rarity; // 0: common, 1: rare, 2: epic, 3: legendary
        bool exists;
    }
    
    struct LeaderboardEntry {
        address user;
        uint256 points;
        uint256 earnings;
        uint256 tests;
        uint256 lastUpdate;
    }
    
    // ===================== MAPPINGS =====================
    
    mapping(address => UserProfile) public userProfiles;
    mapping(address => BandwidthTest[]) public userBandwidthTests;
    mapping(address => ValidatorNode[]) public userNodes;
    mapping(address => ReferralData) public referralData;
    mapping(address => address[]) public userReferrals; // referrer => referred users
    mapping(string => address) public referralCodes; // code => referrer address
    mapping(address => string) public userReferralCodes; // user => their code
    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => PendingReward[]) public pendingRewards;
    mapping(bytes32 => bool) public usedProofHashes;
    mapping(bytes32 => Achievement) public achievements;
    mapping(address => mapping(bytes32 => bool)) public userAchievements;
    mapping(address => uint256) public userRanks;
    mapping(uint256 => LeaderboardEntry) public leaderboard; // rank => entry
    
    // ===================== ARRAYS =====================
    
    address[] public allUsers;
    bytes32[] public allAchievements;
    uint256 public totalUsers;
    uint256 public leaderboardSize;
    
    // ===================== CONSTANTS =====================
    
    uint256 public constant MIN_TEST_REWARD = 1e18; // 1 U2U
    uint256 public constant MAX_TEST_REWARD = 10e18; // 10 U2U
    uint256 public constant XP_PER_TEST = 10;
    uint256 public constant REFERRAL_BONUS_PERCENT = 15;
    uint256 public constant STAKING_APY = 1250; // 12.50% (basis points)
    uint256 public constant STAKING_LOCK_PERIOD = 30 days;
    uint256 public constant QUALIFICATION_TESTS = 5;
    
    // ===================== EVENTS =====================
    
    event BandwidthTestSubmitted(address indexed validator, bytes32 indexed proofHash, uint256 rewardAmount, uint256 timestamp);
    event RewardClaimed(address indexed user, uint256 amount, uint8 rewardType, uint256 timestamp);
    event ProfileUpdated(address indexed user, string username, uint256 level);
    event UserReferred(address indexed referrer, address indexed referred, string referralCode);
    event NodeRegistered(address indexed owner, string name, string location, uint256 timestamp);
    event TokensStaked(address indexed user, uint256 amount, uint256 lockEndTime);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event AchievementUnlocked(address indexed user, bytes32 indexed achievementId, uint256 xpReward, uint256 tokenReward);
    event LeaderboardUpdated(address indexed user, uint256 oldRank, uint256 newRank);

    // ===================== CONSTRUCTOR =====================
    
    constructor(address _u2uToken, address _fluxToken) Ownable(msg.sender) {
        u2uToken = IERC20(_u2uToken);
        fluxToken = IERC20(_fluxToken);
        
        // Initialize default achievements
        initializeAchievements();
    }

    // ===================== BANDWIDTH TESTING SYSTEM =====================
    
    function submitBandwidthTest(
        uint256 _uploadSpeed,
        uint256 _downloadSpeed,
        uint256 _latency,
        bytes32 _proofHash
    ) external nonReentrant {
        require(!usedProofHashes[_proofHash], "Proof hash already used");
        require(_uploadSpeed > 0 && _downloadSpeed > 0, "Invalid speed values");
        require(_latency < 1000, "Latency too high");
        
        usedProofHashes[_proofHash] = true;
        uint256 rewardAmount = calculateBandwidthReward(_uploadSpeed, _downloadSpeed, _latency);
        
        // Store test result
        BandwidthTest memory test = BandwidthTest({
            validator: msg.sender,
            uploadSpeed: _uploadSpeed,
            downloadSpeed: _downloadSpeed,
            latency: _latency,
            timestamp: block.timestamp,
            proofHash: _proofHash,
            rewardAmount: rewardAmount,
            verified: true
        });
        
        userBandwidthTests[msg.sender].push(test);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
            profile.level = 1;
            allUsers.push(msg.sender);
            totalUsers++;
        }
        
        profile.totalTests++;
        profile.successfulTests++;
        profile.totalXP += XP_PER_TEST;
        profile.totalEarnings += rewardAmount;
        
        // Update level and check achievements
        updateUserLevel(msg.sender);
        checkAchievements(msg.sender);
        
        // Add to pending rewards
        pendingRewards[msg.sender].push(PendingReward({
            amount: rewardAmount,
            timestamp: block.timestamp,
            proofHash: _proofHash,
            rewardType: 0, // bandwidth test
            claimed: false
        }));
        
        // Process referral bonus
        processReferralBonus(msg.sender, rewardAmount);
        
        // Update leaderboard
        updateLeaderboard(msg.sender);
        
        emit BandwidthTestSubmitted(msg.sender, _proofHash, rewardAmount, block.timestamp);
    }
    
    function calculateBandwidthReward(uint256 _uploadSpeed, uint256 _downloadSpeed, uint256 _latency) internal pure returns (uint256) {
        uint256 baseReward = MIN_TEST_REWARD;
        uint256 avgSpeed = (_uploadSpeed + _downloadSpeed) / 2;
        
        // Speed bonuses
        if (avgSpeed > 100) baseReward += 1e18;
        if (avgSpeed > 200) baseReward += 2e18;
        if (avgSpeed > 500) baseReward += 3e18;
        
        // Latency bonuses
        if (_latency < 20) baseReward += 1e18;
        if (_latency < 10) baseReward += 2e18;
        
        return baseReward > MAX_TEST_REWARD ? MAX_TEST_REWARD : baseReward;
    }

    // ===================== REFERRAL SYSTEM =====================
    
    function generateReferralCode(string calldata _code) external {
        require(bytes(_code).length >= 6, "Code too short");
        require(referralCodes[_code] == address(0), "Code already exists");
        require(bytes(userReferralCodes[msg.sender]).length == 0, "User already has code");
        
        referralCodes[_code] = msg.sender;
        userReferralCodes[msg.sender] = _code;
    }
    
    function joinWithReferral(string calldata _referralCode) external {
        address referrer = referralCodes[_referralCode];
        require(referrer != address(0), "Invalid referral code");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referralData[msg.sender].referrer == address(0), "Already has referrer");
        
        // Set referral data
        referralData[msg.sender] = ReferralData({
            referrer: referrer,
            joinTimestamp: block.timestamp,
            totalRewards: 0,
            qualified: false,
            tier: 0 // Bronze
        });
        
        userReferrals[referrer].push(msg.sender);
        userProfiles[referrer].referralCount++;
        
        // Update referrer tier
        updateReferralTier(referrer);
        
        emit UserReferred(referrer, msg.sender, _referralCode);
    }
    
    function processReferralBonus(address _user, uint256 _testReward) internal {
        ReferralData storage refData = referralData[_user];
        if (refData.referrer == address(0)) return;
        
        address referrer = refData.referrer;
        uint256 baseBonus = (_testReward * REFERRAL_BONUS_PERCENT) / 100;
        
        // Apply tier multiplier
        uint256 tierMultiplier = getReferralTierMultiplier(referralData[referrer].tier);
        uint256 bonusAmount = (baseBonus * tierMultiplier) / 100;
        
        // Add bonus to referrer's pending rewards
        pendingRewards[referrer].push(PendingReward({
            amount: bonusAmount,
            timestamp: block.timestamp,
            proofHash: bytes32(0),
            rewardType: 1, // referral bonus
            claimed: false
        }));
        
        refData.totalRewards += bonusAmount;
        userProfiles[referrer].totalEarnings += bonusAmount;
        
        // Check qualification
        if (!refData.qualified && userProfiles[_user].successfulTests >= QUALIFICATION_TESTS) {
            refData.qualified = true;
        }
    }
    
    function updateReferralTier(address _user) internal {
        uint256 referralCount = userProfiles[_user].referralCount;
        ReferralData storage refData = referralData[_user];
        
        if (referralCount >= 100) refData.tier = 4; // Diamond
        else if (referralCount >= 50) refData.tier = 3; // Platinum
        else if (referralCount >= 25) refData.tier = 2; // Gold
        else if (referralCount >= 10) refData.tier = 1; // Silver
        else refData.tier = 0; // Bronze
    }
    
    function getReferralTierMultiplier(uint256 _tier) internal pure returns (uint256) {
        if (_tier == 4) return 130; // Diamond: +30%
        if (_tier == 3) return 125; // Platinum: +25%
        if (_tier == 2) return 120; // Gold: +20%
        if (_tier == 1) return 115; // Silver: +15%
        return 100; // Bronze: base rate
    }

    // ===================== NODE MANAGEMENT SYSTEM =====================
    
    function registerNode(
        string calldata _name,
        string calldata _location,
        string calldata _ipAddress
    ) external {
        ValidatorNode memory newNode = ValidatorNode({
            name: _name,
            location: _location,
            ipAddress: _ipAddress,
            registrationTime: block.timestamp,
            uptime: 100,
            totalTests: 0,
            successfulTests: 0,
            totalEarnings: 0,
            active: true,
            owner: msg.sender
        });
        
        userNodes[msg.sender].push(newNode);
        
        emit NodeRegistered(msg.sender, _name, _location, block.timestamp);
    }
    
    function updateNodeStatus(uint256 _nodeIndex, bool _active) external {
        require(_nodeIndex < userNodes[msg.sender].length, "Invalid node index");
        userNodes[msg.sender][_nodeIndex].active = _active;
    }
    
    function updateNodePerformance(
        uint256 _nodeIndex,
        uint256 _uptime,
        uint256 _totalTests,
        uint256 _successfulTests
    ) external onlyOwner {
        ValidatorNode[] storage nodes = userNodes[msg.sender];
        require(_nodeIndex < nodes.length, "Invalid node index");
        
        nodes[_nodeIndex].uptime = _uptime;
        nodes[_nodeIndex].totalTests = _totalTests;
        nodes[_nodeIndex].successfulTests = _successfulTests;
    }

    // ===================== STAKING SYSTEM =====================
    
    function stakeTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(u2uToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        StakingInfo storage info = stakingInfo[msg.sender];
        
        // Claim existing rewards first
        if (info.stakedAmount > 0) {
            uint256 rewards = calculateStakingRewards(msg.sender);
            if (rewards > 0) {
                info.rewardsEarned += rewards;
                info.lastClaimTime = block.timestamp;
            }
        }
        
        // Add to stake
        info.stakedAmount += _amount;
        info.stakingTimestamp = block.timestamp;
        info.lockEndTime = block.timestamp + STAKING_LOCK_PERIOD;
        info.isStaking = true;
        if (info.lastClaimTime == 0) info.lastClaimTime = block.timestamp;
        
        emit TokensStaked(msg.sender, _amount, info.lockEndTime);
    }
    
    function unstakeTokens(uint256 _amount) external nonReentrant {
        StakingInfo storage info = stakingInfo[msg.sender];
        require(info.stakedAmount >= _amount, "Insufficient staked amount");
        require(block.timestamp >= info.lockEndTime, "Still locked");
        
        // Calculate and add rewards
        uint256 rewards = calculateStakingRewards(msg.sender);
        info.rewardsEarned += rewards;
        
        // Update staking info
        info.stakedAmount -= _amount;
        info.lastClaimTime = block.timestamp;
        if (info.stakedAmount == 0) info.isStaking = false;
        
        // Transfer tokens back
        require(u2uToken.transfer(msg.sender, _amount), "Transfer failed");
        
        // Add staking rewards to pending
        if (rewards > 0) {
            pendingRewards[msg.sender].push(PendingReward({
                amount: rewards,
                timestamp: block.timestamp,
                proofHash: bytes32(0),
                rewardType: 2, // staking reward
                claimed: false
            }));
        }
        
        emit TokensUnstaked(msg.sender, _amount, rewards);
    }
    
    function calculateStakingRewards(address _user) internal view returns (uint256) {
        StakingInfo storage info = stakingInfo[_user];
        if (info.stakedAmount == 0 || info.lastClaimTime == 0) return 0;
        
        uint256 timeStaked = block.timestamp - info.lastClaimTime;
        if (timeStaked == 0) return 0;
        
        // APY calculation: (staked * APY * timeStaked) / (365 days * 10000)
        return (info.stakedAmount * STAKING_APY * timeStaked) / (365 days * 10000);
    }

    // ===================== ACHIEVEMENT SYSTEM =====================
    
    function initializeAchievements() internal {
        // Testing achievements
        createAchievement("FIRST_TEST", "First Steps", "Complete your first bandwidth test", 10, 0, 0, 0);
        createAchievement("SPEED_DEMON", "Speed Demon", "Complete 100 bandwidth tests", 100, 5e18, 0, 1);
        createAchievement("CONSISTENCY", "Consistent Performer", "Maintain 30-day streak", 300, 25e18, 0, 2);
        
        // Social achievements  
        createAchievement("SOCIAL_BUTTERFLY", "Social Butterfly", "Refer 10 friends", 150, 15e18, 2, 1);
        createAchievement("COMMUNITY_BUILDER", "Community Builder", "Refer 50 friends", 500, 50e18, 2, 2);
        
        // Earnings achievements
        createAchievement("NETWORK_SUPPORTER", "Network Supporter", "Earn 1000 U2U tokens", 500, 50e18, 1, 3);
        createAchievement("WHALE_STATUS", "Whale Status", "Stake 10000 U2U tokens", 1000, 100e18, 1, 3);
        
        // Special achievements
        createAchievement("EARLY_ADOPTER", "Early Adopter", "Join in first month", 200, 10e18, 3, 2);
        createAchievement("LEGEND_STATUS", "Legend Status", "Reach level 6", 1000, 100e18, 3, 3);
    }
    
    function createAchievement(
        string memory _id,
        string memory _name,
        string memory _description,
        uint256 _xpReward,
        uint256 _tokenReward,
        uint8 _category,
        uint8 _rarity
    ) internal {
        bytes32 achievementId = keccak256(abi.encodePacked(_id));
        achievements[achievementId] = Achievement({
            name: _name,
            description: _description,
            xpReward: _xpReward,
            tokenReward: _tokenReward,
            category: _category,
            rarity: _rarity,
            exists: true
        });
        allAchievements.push(achievementId);
    }
    
    function checkAchievements(address _user) internal {
        UserProfile storage profile = userProfiles[_user];
        
        // Check testing achievements
        checkTestingAchievements(_user, profile);
        
        // Check social achievements
        checkSocialAchievements(_user, profile);
        
        // Check earnings achievements
        checkEarningsAchievements(_user, profile);
        
        // Check special achievements
        checkSpecialAchievements(_user, profile);
    }
    
    function checkTestingAchievements(address _user, UserProfile storage _profile) internal {
        bytes32 firstTestId = keccak256(abi.encodePacked("FIRST_TEST"));
        bytes32 speedDemonId = keccak256(abi.encodePacked("SPEED_DEMON"));
        
        // First test
        if (_profile.totalTests >= 1 && !userAchievements[_user][firstTestId]) {
            unlockAchievement(_user, firstTestId);
        }
        
        // Speed demon
        if (_profile.totalTests >= 100 && !userAchievements[_user][speedDemonId]) {
            unlockAchievement(_user, speedDemonId);
        }
    }
    
    function checkSocialAchievements(address _user, UserProfile storage _profile) internal {
        bytes32 socialButterflyId = keccak256(abi.encodePacked("SOCIAL_BUTTERFLY"));
        bytes32 communityBuilderId = keccak256(abi.encodePacked("COMMUNITY_BUILDER"));
        
        if (_profile.referralCount >= 10 && !userAchievements[_user][socialButterflyId]) {
            unlockAchievement(_user, socialButterflyId);
        }
        
        if (_profile.referralCount >= 50 && !userAchievements[_user][communityBuilderId]) {
            unlockAchievement(_user, communityBuilderId);
        }
    }
    
    function checkEarningsAchievements(address _user, UserProfile storage _profile) internal {
        bytes32 networkSupporterId = keccak256(abi.encodePacked("NETWORK_SUPPORTER"));
        
        if (_profile.totalEarnings >= 1000e18 && !userAchievements[_user][networkSupporterId]) {
            unlockAchievement(_user, networkSupporterId);
        }
    }
    
    function checkSpecialAchievements(address _user, UserProfile storage _profile) internal {
        bytes32 legendStatusId = keccak256(abi.encodePacked("LEGEND_STATUS"));
        
        if (_profile.level >= 6 && !userAchievements[_user][legendStatusId]) {
            unlockAchievement(_user, legendStatusId);
        }
    }
    
    function unlockAchievement(address _user, bytes32 _achievementId) internal {
        Achievement storage achievement = achievements[_achievementId];
        require(achievement.exists, "Achievement does not exist");
        require(!userAchievements[_user][_achievementId], "Achievement already unlocked");
        
        userAchievements[_user][_achievementId] = true;
        userProfiles[_user].achievements.push(_achievementId);
        userProfiles[_user].totalXP += achievement.xpReward;
        
        // Add token reward to pending
        if (achievement.tokenReward > 0) {
            pendingRewards[_user].push(PendingReward({
                amount: achievement.tokenReward,
                timestamp: block.timestamp,
                proofHash: bytes32(0),
                rewardType: 3, // achievement reward
                claimed: false
            }));
        }
        
        updateUserLevel(_user);
        
        emit AchievementUnlocked(_user, _achievementId, achievement.xpReward, achievement.tokenReward);
    }

    // ===================== LEADERBOARD SYSTEM =====================
    
    function updateLeaderboard(address _user) internal {
        UserProfile storage profile = userProfiles[_user];
        uint256 userPoints = calculateUserPoints(_user);
        
        uint256 oldRank = profile.globalRank;
        uint256 newRank = findRankForPoints(userPoints);
        
        if (newRank != oldRank) {
            // Update user rank
            profile.globalRank = newRank;
            userRanks[_user] = newRank;
            
            // Update leaderboard entry
            leaderboard[newRank] = LeaderboardEntry({
                user: _user,
                points: userPoints,
                earnings: profile.totalEarnings,
                tests: profile.totalTests,
                lastUpdate: block.timestamp
            });
            
            // Update leaderboard size
            if (newRank > leaderboardSize) {
                leaderboardSize = newRank;
            }
            
            emit LeaderboardUpdated(_user, oldRank, newRank);
        }
    }
    
    function calculateUserPoints(address _user) internal view returns (uint256) {
        UserProfile storage profile = userProfiles[_user];
        
        // Base points from XP
        uint256 points = profile.totalXP;
        
        // Bonus points from successful tests
        points += profile.successfulTests * 5;
        
        // Bonus points from referrals
        points += profile.referralCount * 20;
        
        // Bonus points from earnings (1 point per 1 U2U earned)
        points += profile.totalEarnings / 1e18;
        
        return points;
    }
    
    function findRankForPoints(uint256 _points) internal view returns (uint256) {
        // Simple ranking algorithm - in production, use more efficient sorting
        uint256 rank = 1;
        
        for (uint256 i = 1; i <= leaderboardSize; i++) {
            if (leaderboard[i].points > _points) {
                rank++;
            }
        }
        
        return rank;
    }

    // ===================== PROFILE & LEVEL SYSTEM =====================
    
    function updateProfile(string calldata _username, string calldata _bio) external {
        UserProfile storage profile = userProfiles[msg.sender];
        
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
            profile.level = 1;
            allUsers.push(msg.sender);
            totalUsers++;
        }
        
        profile.username = _username;
        profile.bio = _bio;
        
        emit ProfileUpdated(msg.sender, _username, profile.level);
    }
    
    function updateUserLevel(address _user) internal {
        UserProfile storage profile = userProfiles[_user];
        uint256 currentXP = profile.totalXP;
        
        uint256 newLevel = 1;
        if (currentXP >= 3000) newLevel = 6; // Legend
        else if (currentXP >= 1500) newLevel = 5; // Master
        else if (currentXP >= 750) newLevel = 4; // Expert
        else if (currentXP >= 300) newLevel = 3; // Validator
        else if (currentXP >= 100) newLevel = 2; // Explorer
        
        profile.level = newLevel;
    }

    // ===================== REWARD CLAIMING SYSTEM =====================
    
    function claimReward(bytes32 _proofHash) external nonReentrant {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        
        for (uint256 i = 0; i < rewards.length; i++) {
            if (rewards[i].proofHash == _proofHash && !rewards[i].claimed) {
                rewards[i].claimed = true;
                require(u2uToken.transfer(msg.sender, rewards[i].amount), "Transfer failed");
                
                emit RewardClaimed(msg.sender, rewards[i].amount, rewards[i].rewardType, block.timestamp);
                return;
            }
        }
        
        revert("Reward not found or already claimed");
    }
    
    function claimAllRewards() external nonReentrant {
        PendingReward[] storage rewards = pendingRewards[msg.sender];
        uint256 totalAmount = 0;
        
        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed) {
                rewards[i].claimed = true;
                totalAmount += rewards[i].amount;
            }
        }
        
        require(totalAmount > 0, "No rewards to claim");
        require(u2uToken.transfer(msg.sender, totalAmount), "Transfer failed");
        
        emit RewardClaimed(msg.sender, totalAmount, 255, block.timestamp);
    }

    // ===================== VIEW FUNCTIONS =====================
    
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    function getUserTests(address _user) external view returns (BandwidthTest[] memory) {
        return userBandwidthTests[_user];
    }
    
    function getUserNodes(address _user) external view returns (ValidatorNode[] memory) {
        return userNodes[_user];
    }
    
    function getUserReferrals(address _user) external view returns (address[] memory) {
        return userReferrals[_user];
    }
    
    function getStakingInfo(address _user) external view returns (StakingInfo memory) {
        return stakingInfo[_user];
    }
    
    function getPendingRewards(address _user) external view returns (uint256 totalAmount) {
        PendingReward[] storage rewards = pendingRewards[_user];
        
        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed) {
                totalAmount += rewards[i].amount;
            }
        }
    }
    
    function getUserPendingRewards(address _user) external view returns (PendingReward[] memory) {
        return pendingRewards[_user];
    }
    
    function getAchievement(bytes32 _achievementId) external view returns (Achievement memory) {
        return achievements[_achievementId];
    }
    
    function getUserAchievements(address _user) external view returns (bytes32[] memory) {
        return userProfiles[_user].achievements;
    }
    
    function getLeaderboardEntry(uint256 _rank) external view returns (LeaderboardEntry memory) {
        return leaderboard[_rank];
    }
    
    function getTopLeaderboard(uint256 _count) external view returns (LeaderboardEntry[] memory) {
        uint256 count = _count > leaderboardSize ? leaderboardSize : _count;
        LeaderboardEntry[] memory topEntries = new LeaderboardEntry[](count);
        
        for (uint256 i = 0; i < count; i++) {
            topEntries[i] = leaderboard[i + 1];
        }
        
        return topEntries;
    }
    
    function getAllAchievements() external view returns (bytes32[] memory) {
        return allAchievements;
    }

    // ===================== ADMIN FUNCTIONS =====================
    
    function emergencyWithdraw() external onlyOwner {
        uint256 u2uBalance = u2uToken.balanceOf(address(this));
        uint256 fluxBalance = fluxToken.balanceOf(address(this));
        
        if (u2uBalance > 0) {
            require(u2uToken.transfer(owner(), u2uBalance), "U2U transfer failed");
        }
        
        if (fluxBalance > 0) {
            require(fluxToken.transfer(owner(), fluxBalance), "FLUX transfer failed");
        }
    }
    
    function addCustomAchievement(
        string calldata _id,
        string calldata _name,
        string calldata _description,
        uint256 _xpReward,
        uint256 _tokenReward,
        uint8 _category,
        uint8 _rarity
    ) external onlyOwner {
        bytes32 achievementId = keccak256(abi.encodePacked(_id));
        require(!achievements[achievementId].exists, "Achievement already exists");
        
        achievements[achievementId] = Achievement({
            name: _name,
            description: _description,
            xpReward: _xpReward,
            tokenReward: _tokenReward,
            category: _category,
            rarity: _rarity,
            exists: true
        });
        
        allAchievements.push(achievementId);
    }
    
    function updateRewardParameters(uint256 _minReward, uint256 _maxReward) external view onlyOwner {
    require(_minReward <= _maxReward, "Invalid reward range");
    }
}