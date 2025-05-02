import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1746211723148 implements MigrationInterface {
  name = 'FirstMigration1746211723148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meta-options" ("id" SERIAL NOT NULL, "metaValue" json NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "REL_67cdd326d3e7cd82b9206c668d" UNIQUE ("postId"), CONSTRAINT "PK_a83c780235673548d69fea9fce7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "schema" text, "featuredImageUrl" character varying, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."posts_posttype_enum" AS ENUM('post', 'page', 'story', 'series')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."posts_status_enum" AS ENUM('draft', 'scheduled', 'review', 'published')`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "postType" "public"."posts_posttype_enum" NOT NULL DEFAULT 'post', "slug" character varying NOT NULL, "status" "public"."posts_status_enum" NOT NULL DEFAULT 'draft', "content" text NOT NULL, "schema" text NOT NULL, "featuredImageUrl" character varying NOT NULL, "publishOn" TIMESTAMP NOT NULL, "authorId" integer, CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying(96) NOT NULL, "lastName" character varying(96), "email" character varying(96) NOT NULL, "password" character varying(96), "googleId" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."uploads_type_enum" AS ENUM('image')`,
    );
    await queryRunner.query(
      `CREATE TABLE "uploads" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "path" character varying NOT NULL, "type" "public"."uploads_type_enum" NOT NULL DEFAULT 'image', "mime" character varying NOT NULL, "size" integer NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts_tags_tags" ("postsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_0102fd077ecbe473388af8f3358" PRIMARY KEY ("postsId", "tagsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf364c7e6905b285c4b55a0034" ON "posts_tags_tags" ("postsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce163a967812183a51b044f740" ON "posts_tags_tags" ("tagsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "meta-options" ADD CONSTRAINT "FK_67cdd326d3e7cd82b9206c668d8" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_cf364c7e6905b285c4b55a00343" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_ce163a967812183a51b044f7404" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_ce163a967812183a51b044f7404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_cf364c7e6905b285c4b55a00343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta-options" DROP CONSTRAINT "FK_67cdd326d3e7cd82b9206c668d8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce163a967812183a51b044f740"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf364c7e6905b285c4b55a0034"`,
    );
    await queryRunner.query(`DROP TABLE "posts_tags_tags"`);
    await queryRunner.query(`DROP TABLE "uploads"`);
    await queryRunner.query(`DROP TYPE "public"."uploads_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."posts_posttype_enum"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "meta-options"`);
  }
}
