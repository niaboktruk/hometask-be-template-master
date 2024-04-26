const adminService = require("../modules/admin/admin.service");
const { buildModelMock, buildSequelizeMock } = require("../shared/TestSetup");

const jobModelMock = buildModelMock();
const contractModelMock = buildModelMock();
const profileModelMock = buildModelMock();
const mockedSequelize = buildSequelizeMock();

describe("Admin service", () => {
  describe("Best professions", () => {
    it("should return the best profession", async () => {
      const startDate = new Date("2020-01-01");
      const endDate = new Date("2024-01-01");
      const expectedProfession = "Programmer";

      const jobQueryResponse = [
        {
          id: 1,
          Contract: {
            Contractor: {
              profession: expectedProfession,
            },
          },
          amountEarned: 1000,
        },
      ];

      jobModelMock.findAll = jest.fn().mockResolvedValue(jobQueryResponse);

      const result = await adminService.findBestProfession({
        sequelize: mockedSequelize,
        startDate,
        endDate,
        Job: jobModelMock,
        Contract: contractModelMock,
        Profile: profileModelMock,
      });

      expect(result).toBe(expectedProfession);
    });
  });

  describe("Best clients", () => {
    it("should return the list of best clients", async () => {
      const startDate = new Date("2020-01-01");
      const endDate = new Date("2024-01-01");

      const jobQueryResponse = [
        {
          id: 1,
          Contract: {
            Contractor: {
              profession: "Programmer",
            },
          },
          amountEarned: 1000,
        },
      ];

      const result = await adminService.findBestClients({
        limit: 2,
        sequelize: mockedSequelize,
        startDate,
        endDate,
        Job: jobModelMock,
        Contract: contractModelMock,
        Profile: profileModelMock,
      });

      expect(result).toEqual(jobQueryResponse);
    });
  });
});
