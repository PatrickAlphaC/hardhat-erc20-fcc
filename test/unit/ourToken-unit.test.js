const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config");

describe("OurToken Unit Test", function () {

    let ourToken, deployer, user1;
    beforeEach(async function () {
        const accounts = await getNamedAccounts();
        deployer = accounts.deployer;
        user1 = accounts.user1;

        await deployments.fixture("all");
        ourToken = await ethers.getContract("OurToken", deployer);
    });
   
    it("Should have correct INITIAL_SUPPLY of token ", async function () {
        const totalSupply = await ourToken.totalSupply();
        assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
    }); 

    it("Should be able to transfer tokens successfully to an address", async function () {
        const tokensToSend = ethers.utils.parseEther("10");
        await ourToken.transfer(user1,tokensToSend);
        expect(await ourToken.balanceOf(user1)).to.equal(tokensToSend);
    });

    it("Should approve other address to spend token", async () => {
        const tokensToSpend = ethers.utils.parseEther("5");
        await ourToken.approve(user1, tokensToSpend);
        const ourToken1 = await ethers.getContract("OurToken", user1);
        await ourToken1.transferFrom(deployer,user1,tokensToSpend);
        expect(await ourToken1.balanceOf(user1)).to.equal(tokensToSpend);
    });
});