pragma solidity 0.5.1;
pragma experimental ABIEncoderV2;
/**
 * @title Defiat
 * @dev 
 */
library TotlePrimaryUtils {
    struct Order {
        address payable exchangeHandler;
        bytes encodedPayload;
    }
    struct Trade {
        address sourceToken;
        address destinationToken;
        uint256 amount;
        bool isSourceAmount; //true if amount is sourceToken, false if it's destinationToken
        Order[] orders;
    }
    struct Swap {
        Trade[] trades;
        uint256 minimumExchangeRate;
        uint256 minimumDestinationAmount;
        uint256 sourceAmount;
        uint256 tradeToTakeFeeFrom;
        bool takeFeeFromSource; //Takes the fee before the trade if true, takes it after if false
        address payable redirectAddress;
        bool required;
    }
    struct SwapCollection {
        Swap[] swaps;
        address payable partnerContract;
        uint256 expirationBlock;
        bytes32 id;
        uint256 maxGasPrice;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
}
interface TotlePrimary {
    function performSwapCollection(
        TotlePrimaryUtils.SwapCollection calldata swaps
    ) external payable;
}
contract Defiat {
    address payable private admin;
    address payable private owner;
    bool private canceled;
    constructor(address payable user) public {
        admin = msg.sender;
        owner = user;
    }
    modifier only(address _user) {
        require(msg.sender == _user);
        _;
    }
    modifier active() {
        require(canceled == false);
        _;
    }
    function swap(TotlePrimaryUtils.SwapCollection memory swapCollection, TotlePrimary primary) public active() only(admin) {
        uint256 balance = address(this).balance;
        require(balance > 0);
        primary.performSwapCollection.value(balance)(swapCollection); 
        selfdestruct(owner);
    }
    function cancel() public only(owner) {
        canceled = true;
        if (address(this).balance > 0) {
            owner.transfer(address(this).balance);
        }
    }
    function destroy() public only(admin) {
        selfdestruct(owner);
    }
    function () payable external {
        if (canceled) {
            owner.transfer(msg.value);
            selfdestruct(owner);
        }
    }
}
