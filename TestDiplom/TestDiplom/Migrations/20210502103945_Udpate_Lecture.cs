using Microsoft.EntityFrameworkCore.Migrations;

namespace TestDiplom.Migrations
{
    public partial class Udpate_Lecture : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TestId",
                table: "Lectures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_TestId",
                table: "Lectures",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lectures_Tests_TestId",
                table: "Lectures",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lectures_Tests_TestId",
                table: "Lectures");

            migrationBuilder.DropIndex(
                name: "IX_Lectures_TestId",
                table: "Lectures");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "Lectures");
        }
    }
}
