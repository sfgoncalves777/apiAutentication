import Knex from 'knex';

export async function up (knex: Knex) {
  return knex.schema.createTable('users_login', table => {
    table.increments().primary();
    table.string('token_user');
    table.integer('id_user');
  });
}

export async function down (knex: Knex) {
  return knex.schema.dropTable('users_login');
}