// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — SWAP & DEX CONNECTOR
//  Uniswap V3 Integration · Web3 Quantum Hybrid
//  © 2026 Grigori Saks | Meta Genius TR2 Protocol
// ============================================================

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function approve(address spender, uint256 amount) external returns (bool);
}

/// @title QEMMASwap — DEX Connector & Swap Router
/// @notice Connects QEMMA to Uniswap V3, handles ETH↔QEMMA swaps
contract QEMMASwap {

    // ─── ADDRESSES ────────────────────────────────────────────────────────────
    ISwapRouter public constant UNISWAP_V3_ROUTER =
        ISwapRouter(0xe592427A0AEce92De3Edee1F18E0157C05861564);
    address public constant WETH =
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDT =
        0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public constant USDC =
        0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    address public immutable qemmaToken;
    address public owner;

    // ─── POOL FEES ────────────────────────────────────────────────────────────
    uint24 public constant FEE_LOW    = 500;   // 0.05% — stable pairs
    uint24 public constant FEE_MEDIUM = 3000;  // 0.30% — standard
    uint24 public constant FEE_HIGH   = 10000; // 1.00%  — exotic

    // ─── STATS ────────────────────────────────────────────────────────────────
    uint256 public totalSwapsExecuted;
    uint256 public totalVolumeETH;
    uint256 public totalVolumeQEMMA;

    struct SwapRecord {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
    }
    SwapRecord[] public swapHistory;
    mapping(address => SwapRecord[]) public userSwaps;

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    event SwapExecuted(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event LiquidityAdded(address indexed user, uint256 ethAmount, uint256 qemmaAmount);
    event ETHReceived(address indexed sender, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor(address _qemmaToken) {
        qemmaToken = _qemmaToken;
        owner = msg.sender;
    }

    receive() external payable { emit ETHReceived(msg.sender, msg.value); }

    // ─── ETH → QEMMA ──────────────────────────────────────────────────────────
    function swapETHForQEMMA(
        uint256 amountOutMinimum,
        uint256 deadline
    ) external payable returns (uint256 amountOut) {
        require(msg.value > 0, "Send ETH");

        IWETH(WETH).deposit{value: msg.value}();
        IWETH(WETH).approve(address(UNISWAP_V3_ROUTER), msg.value);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn:           WETH,
            tokenOut:          qemmaToken,
            fee:               FEE_MEDIUM,
            recipient:         msg.sender,
            deadline:          deadline,
            amountIn:          msg.value,
            amountOutMinimum:  amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        amountOut = UNISWAP_V3_ROUTER.exactInputSingle(params);

        _recordSwap(msg.sender, WETH, qemmaToken, msg.value, amountOut);
        totalVolumeETH += msg.value;
        totalVolumeQEMMA += amountOut;

        emit SwapExecuted(msg.sender, WETH, qemmaToken, msg.value, amountOut);
    }

    // ─── QEMMA → ETH ──────────────────────────────────────────────────────────
    function swapQEMMAForETH(
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint256 deadline
    ) external returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be > 0");
        IERC20(qemmaToken).transferFrom(msg.sender, address(this), amountIn);
        IERC20(qemmaToken).approve(address(UNISWAP_V3_ROUTER), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn:           qemmaToken,
            tokenOut:          WETH,
            fee:               FEE_MEDIUM,
            recipient:         address(this),
            deadline:          deadline,
            amountIn:          amountIn,
            amountOutMinimum:  amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        amountOut = UNISWAP_V3_ROUTER.exactInputSingle(params);
        IWETH(WETH).withdraw(amountOut);
        payable(msg.sender).transfer(amountOut);

        _recordSwap(msg.sender, qemmaToken, WETH, amountIn, amountOut);
        totalVolumeQEMMA += amountIn;
        totalVolumeETH += amountOut;

        emit SwapExecuted(msg.sender, qemmaToken, WETH, amountIn, amountOut);
    }

    // ─── QEMMA → USDT ─────────────────────────────────────────────────────────
    function swapQEMMAForUSDT(
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint256 deadline
    ) external returns (uint256 amountOut) {
        IERC20(qemmaToken).transferFrom(msg.sender, address(this), amountIn);
        IERC20(qemmaToken).approve(address(UNISWAP_V3_ROUTER), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn:           qemmaToken,
            tokenOut:          USDT,
            fee:               FEE_LOW,
            recipient:         msg.sender,
            deadline:          deadline,
            amountIn:          amountIn,
            amountOutMinimum:  amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        amountOut = UNISWAP_V3_ROUTER.exactInputSingle(params);
        _recordSwap(msg.sender, qemmaToken, USDT, amountIn, amountOut);
        emit SwapExecuted(msg.sender, qemmaToken, USDT, amountIn, amountOut);
    }

    // ─── SEND / RECEIVE QEMMA ─────────────────────────────────────────────────
    function sendQEMMA(address recipient, uint256 amount) external {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        IERC20(qemmaToken).transferFrom(msg.sender, recipient, amount);
        _recordSwap(msg.sender, qemmaToken, qemmaToken, amount, amount);
        emit SwapExecuted(msg.sender, qemmaToken, qemmaToken, amount, amount);
    }

    // ─── INTERNAL ─────────────────────────────────────────────────────────────
    function _recordSwap(address user, address tIn, address tOut, uint256 aIn, uint256 aOut) internal {
        SwapRecord memory rec = SwapRecord(user, tIn, tOut, aIn, aOut, block.timestamp);
        swapHistory.push(rec);
        userSwaps[user].push(rec);
        totalSwapsExecuted++;
    }

    function getUserSwapHistory(address user) external view returns (SwapRecord[] memory) {
        return userSwaps[user];
    }

    function getSwapStats() external view returns (uint256 swaps, uint256 volETH, uint256 volQEMMA) {
        return (totalSwapsExecuted, totalVolumeETH, totalVolumeQEMMA);
    }

    function rescueETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
