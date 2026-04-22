import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("events", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title", 255).notNullable();
    table.text("description").defaultTo("");
    table.string("category", 100).defaultTo("Other");
    table.string("date", 50).defaultTo("");
    table.string("time", 50).defaultTo("");
    table.string("location", 255).defaultTo("");
    table.integer("attendees").defaultTo(0);
    table.string("price", 50).defaultTo("Free");
    table.text("image").defaultTo("");
    table.string("tag", 100).defaultTo("New");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("events");
}
