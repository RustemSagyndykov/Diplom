using Microsoft.EntityFrameworkCore.Migrations;

namespace TestDiplom.Migrations
{
    public partial class Uodate_TestQuestionAnswerandTestQuestion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TestId",
                table: "TestQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TestQuestionId",
                table: "TestQuestionAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TestQuestions_TestId",
                table: "TestQuestions",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_TestQuestionAnswers_TestQuestionId",
                table: "TestQuestionAnswers",
                column: "TestQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestQuestionAnswers_TestQuestions_TestQuestionId",
                table: "TestQuestionAnswers",
                column: "TestQuestionId",
                principalTable: "TestQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestQuestions_Tests_TestId",
                table: "TestQuestions",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestQuestionAnswers_TestQuestions_TestQuestionId",
                table: "TestQuestionAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_TestQuestions_Tests_TestId",
                table: "TestQuestions");

            migrationBuilder.DropIndex(
                name: "IX_TestQuestions_TestId",
                table: "TestQuestions");

            migrationBuilder.DropIndex(
                name: "IX_TestQuestionAnswers_TestQuestionId",
                table: "TestQuestionAnswers");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "TestQuestions");

            migrationBuilder.DropColumn(
                name: "TestQuestionId",
                table: "TestQuestionAnswers");
        }
    }
}
