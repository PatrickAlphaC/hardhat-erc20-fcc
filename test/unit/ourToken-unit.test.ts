import { BigNumber } from "ethers"
import { assert, expect } from "chai"
import { OurToken } from "../../typechain-types"
import { deployments, ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains, INITIAL_SUPPLY } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OurToken Unit Test", () => {
      const multiplier = 10 ** 18
      let ourToken: OurToken,
        deployer: SignerWithAddress,
        user1: SignerWithAddress
      beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]

        await deployments.fixture("all")
        ourToken = await ethers.getContract("OurToken", deployer)
      })
      it("Gets deployed correctly", async () => {
        assert(ourToken.address)
      })
      describe("Constructor", () => {
        it("Should have correct INITIAL_SUPPLY of token ", async () => {
          const totalSupply: BigNumber = await ourToken.totalSupply()
          assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
        })
        it("Initializes the token with the correct name and symbol ", async () => {
          const name = (await ourToken.name()).toString()
          assert.equal(name, "OurToken")
          const symbol = (await ourToken.symbol()).toString()
          assert.equal(symbol, "OT")
        })
      })
      describe("Transfers", () => {
        it("Should be able to transfer tokens successfully to an address", async function () {
          const tokensToSend = ethers.utils.parseEther("10")
          await ourToken.transfer(user1.address, tokensToSend)
          expect(await ourToken.balanceOf(user1.address)).to.equal(tokensToSend)
        })
        it("Emits an transfer event, when an transfer occurs", async () => {
          await expect(
            ourToken.transfer(user1.address, (10 * multiplier).toString())
          ).to.emit(ourToken, "Transfer")
        })
      })
      describe("Allowances", () => {
        it("Should approve other address to spend token", async () => {
          const tokensToSpend = ethers.utils.parseEther("5")
          await ourToken.approve(user1.address, tokensToSpend)
          const ourToken1 = await ethers.getContract("OurToken", user1)
          await ourToken1.transferFrom(
            deployer.address,
            user1.address,
            tokensToSpend
          )
          expect(await ourToken1.balanceOf(user1.address)).to.equal(
            tokensToSpend
          )
        })
      })
    })
