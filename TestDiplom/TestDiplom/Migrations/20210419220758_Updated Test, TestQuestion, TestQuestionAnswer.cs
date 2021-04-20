using Microsoft.EntityFrameworkCore.Migrations;

namespace TestDiplom.Migrations
{
    public partial class UpdatedTestTestQuestionTestQuestionAnswer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdForView",
                table: "Tests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdForView",
                table: "TestQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdForView",
                table: "TestQuestionAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdForView",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "IdForView",
                table: "TestQuestions");

            migrationBuilder.DropColumn(
                name: "IdForView",
                table: "TestQuestionAnswers");
        }
    }
}
