using Microsoft.EntityFrameworkCore.Migrations;

namespace TestDiplom.Migrations
{
    public partial class Added_StudentPractice_And_StudentPracticeFile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentPractices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PracticeId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PracticeScore = table.Column<double>(type: "float", nullable: false),
                    IsAccept = table.Column<bool>(type: "bit", nullable: false),
                    IsRevision = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentPractices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentPractices_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentPractices_Practices_PracticeId",
                        column: x => x.PracticeId,
                        principalTable: "Practices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentPracticeFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Path = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentPracticeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentPracticeFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentPracticeFiles_StudentPractices_StudentPracticeId",
                        column: x => x.StudentPracticeId,
                        principalTable: "StudentPractices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentPracticeFiles_StudentPracticeId",
                table: "StudentPracticeFiles",
                column: "StudentPracticeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPractices_PracticeId",
                table: "StudentPractices",
                column: "PracticeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPractices_StudentId",
                table: "StudentPractices",
                column: "StudentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentPracticeFiles");

            migrationBuilder.DropTable(
                name: "StudentPractices");
        }
    }
}
