import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reviews", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("event_id").notNullable().references("id").inTable("events").onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.integer("rating").notNullable().checkBetween([1, 5]);
    table.text("comment").notNullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reviews");
}
