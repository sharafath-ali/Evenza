import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("bookings", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("event_id").notNullable().references("id").inTable("events").onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.integer("qty").notNullable().defaultTo(1);
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("bookings");
}
