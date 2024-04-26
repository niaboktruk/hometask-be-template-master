const {
  buildModelMock,
  FakeClient,
  buildSequelizeMock,
} = require("../shared/TestSetup");
const balancesService = require("../modules/balances/balance.service");

const profileModelMock = buildModelMock();
const jobModelMock = buildModelMock();
const sequelizeMock = buildSequelizeMock();

describe("Balance service", () => {
  describe("deposit", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not deposit above the limit", async () => {
      const fakeClient = FakeClient(1, "Hello", 100);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(100);

      try {
        await balancesService.depositBalance({
          profile: fakeClient,
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
          amount: 100,
        });
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("You exceeded the amount you can deposit");
      }
    });

    it("should throw an error when no amount provided", async () => {
      const fakeClient = FakeClient(1, "Hello", 100);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(100);

      try {
        await balancesService.depositBalance({
          profile: fakeClient,
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
        });
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("You need to provide a deposit amount");
      }
    });

    it("should deposit, commit and return client", async () => {
      const fakeClient = FakeClient(1, "Hello", 10);
      const fakeClient2 = FakeClient(2, "My Baby", 20);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(200);

      const commitSpy = jest.fn();
      sequelizeMock.transaction.mockImplementation(() => {
        return {
          commit: commitSpy,
        };
      });

      const client = await balancesService.depositBalance({
        profile: fakeClient,
        userId: fakeClient2,
        Profile: profileModelMock,
        Job: jobModelMock,
        sequelize: sequelizeMock,
        amount: 5,
      });

      expect(sequelizeMock.transaction).toBeCalled();
      expect(commitSpy).toBeCalled();
      expect(client).toBe(fakeClient);
    });

    it("should rollback in case of error", async () => {
      const err = new Error("Amount unavailable");
      jobModelMock.sum.mockRejectedValue(err);

      const rollbackSpy = jest.fn();
      sequelizeMock.transaction.mockImplementation(() => {
        return {
          rollback: rollbackSpy,
        };
      });

      try {
        await balancesService.depositBalance({
          profile: {},
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
          amount: 25,
        });
      } catch (error) {
        expect(error).toEqual(err);
        expect(rollbackSpy).toBeCalled();
      }
    });
  });
});
