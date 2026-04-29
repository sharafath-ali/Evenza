import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("bookings", (table) => {
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("user_id");
  });
}
