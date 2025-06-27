import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751000896103 implements MigrationInterface {
  name = 'Migration1751000896103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "manufacturer" ("id" SERIAL NOT NULL, "make" character varying(95) NOT NULL, "image" character varying(1024), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_81fc5abca8ed2f6edc79b375eeb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_model" ("id" SERIAL NOT NULL, "model" character varying(96) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99d77a8d90b9846c144a7b56737" UNIQUE ("model"), CONSTRAINT "PK_525071eea12c671d67e35a5cbc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_numberofcylinders_enum" AS ENUM('2', '3', '4', '5', '6', '8', '10', '12', '0')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_mileagetype_enum" AS ENUM('km', 'mile')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_steeringwheel_enum" AS ENUM('left', 'right')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_transmission_enum" AS ENUM('mechanics', 'automatic', 'triptronic', 'variator')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_drivewheels_enum" AS ENUM('previous', 'rear', '4x4')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_numberofdoors_enum" AS ENUM('2', '3', '4', '5', '>6')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_airbag_enum" AS ENUM('0', '2', '4', '6', '8', '10', '12', '12+')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_carcolor_enum" AS ENUM('white', 'black', 'silver', 'gray', 'blue', 'red', 'green', 'brown', 'yellow', 'orange', 'purple', 'gold', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_cabinmaterial_enum" AS ENUM('cloth', 'leather', 'alcantara', 'vinyl', 'mixed', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_cabincolor_enum" AS ENUM('black', 'gray', 'beige', 'red', 'brown', 'white', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_list_carstatus_enum" AS ENUM('used', 'new')`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_list" ("id" SERIAL NOT NULL, "bodyType" character varying NOT NULL, "fuelType" character varying NOT NULL DEFAULT 'gasoline', "numberOfCylinders" "public"."car_list_numberofcylinders_enum" NOT NULL, "year" integer NOT NULL, "engineCapacity" numeric NOT NULL, "turbo" boolean NOT NULL DEFAULT false, "mileage" integer NOT NULL, "mileageType" "public"."car_list_mileagetype_enum" NOT NULL DEFAULT 'km', "steeringWheel" "public"."car_list_steeringwheel_enum" NOT NULL DEFAULT 'left', "transmission" "public"."car_list_transmission_enum" NOT NULL, "driveWheels" "public"."car_list_drivewheels_enum" NOT NULL, "numberOfDoors" "public"."car_list_numberofdoors_enum" NOT NULL DEFAULT '4', "catalyst" boolean NOT NULL DEFAULT false, "airbag" "public"."car_list_airbag_enum" NOT NULL DEFAULT '0', "carColor" "public"."car_list_carcolor_enum" NOT NULL, "cabinMaterial" "public"."car_list_cabinmaterial_enum" NOT NULL, "cabinColor" "public"."car_list_cabincolor_enum" NOT NULL, "description" text NOT NULL, "additionalOptions" text array, "region" character varying(64) NOT NULL, "city" character varying(64) NOT NULL, "photos" character varying array NOT NULL, "video" character varying(255), "price" numeric(12,2) NOT NULL DEFAULT '0', "phoneNumber" character varying(20) NOT NULL, "carStatus" "public"."car_list_carstatus_enum" NOT NULL DEFAULT 'new', "inStock" boolean NOT NULL DEFAULT true, "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "viewsCount" integer NOT NULL DEFAULT '0', "manufacturerId" integer, "modelId" integer, "ownerId" integer, CONSTRAINT "PK_fb28f876f2746f51e0b3fa77a78" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'dealer', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(96) NOT NULL, "profileImage" character varying(1024), "email" character varying(96) NOT NULL, "password" character varying(96), "googleId" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isBlocked" boolean NOT NULL DEFAULT false, "tokenVersion" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_list" ADD CONSTRAINT "FK_310ca0be3ca19155a3a596ef4e3" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_list" ADD CONSTRAINT "FK_1186c322c676a56662e678a29c2" FOREIGN KEY ("modelId") REFERENCES "car_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_list" ADD CONSTRAINT "FK_c694ed2f17e4c9d8478b69800e8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car_list" DROP CONSTRAINT "FK_c694ed2f17e4c9d8478b69800e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_list" DROP CONSTRAINT "FK_1186c322c676a56662e678a29c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_list" DROP CONSTRAINT "FK_310ca0be3ca19155a3a596ef4e3"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "car_list"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_carstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_cabincolor_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_cabinmaterial_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_carcolor_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_airbag_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_numberofdoors_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_drivewheels_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_transmission_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_steeringwheel_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_list_mileagetype_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."car_list_numberofcylinders_enum"`,
    );
    await queryRunner.query(`DROP TABLE "car_model"`);
    await queryRunner.query(`DROP TABLE "manufacturer"`);
  }
}
