using Microsoft.EntityFrameworkCore.Migrations;

namespace TestDiplom.Migrations
{
    public partial class Udpate_Lecture1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PracticeId",
                table: "Lectures",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubjectId",
                table: "Lectures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_PracticeId",
                table: "Lectures",
                column: "PracticeId");

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_SubjectId",
                table: "Lectures",
                column: "SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lectures_Practices_PracticeId",
                table: "Lectures",
                column: "PracticeId",
                principalTable: "Practices",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Lectures_Subjects_SubjectId",
                table: "Lectures",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lectures_Practices_PracticeId",
                table: "Lectures");

            migrationBuilder.DropForeignKey(
                name: "FK_Lectures_Subjects_SubjectId",
                table: "Lectures");

            migrationBuilder.DropIndex(
                name: "IX_Lectures_PracticeId",
                table: "Lectures");

            migrationBuilder.DropIndex(
                name: "IX_Lectures_SubjectId",
                table: "Lectures");

            migrationBuilder.DropColumn(
                name: "PracticeId",
                table: "Lectures");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "Lectures");
        }
    }
}
