let createTable = function(knex){
    return async function(tableName, tableFunction){
        let table = await knex.schema.createTable(tableName, tableFunction);
        console.log("Created table : " + tableName);
        return table
    }

}


let installPayment = async function(knex) {
    let create = createTable(knex);


    await create('funds', function (table) {
        table.increments();
        table.integer('user_id').references('users.id').onDelete('cascade');
        table.boolean('flagged').defaultTo(false);
        table.integer("provider_id");
        table.jsonb('provider_data');
        table.timestamps(true, true);

    });

    /* stripe stuff?

        table.string('invoice_id').unique();
        table.string('charge');
        table.string('subscription');
        table.float('discount');
        table.integer('attempt_count');
        table.bigInteger('date');
        table.bigInteger('next_attempt');
        table.string('receipt_number');
        table.float('starting_balance');
        table.float('ending_balance');
        table.boolean('livemode');
        table.float('amount_due');

     */

    /* other stuff
        table.integer('user_id').references('users.id');
        table.integer('service_instance_id')


     */
    await create('user_invoices', function (table) {
        table.increments();
        table.integer('payment_account_id').references('payment_account.id');
        table.jsonb("provider_data");
        table.string('description');
        table.boolean('closed');
        table.string('currency');
        table.boolean('forgiven');
        table.boolean('paid');
        table.bigInteger('period_end');
        table.bigInteger('period_start');
        table.float('total');
        table.timestamps(true, true);

    });


    /*

            table.string('subscription_id');
        table.string('item_id');


     */

    /*

        table.integer('user_id').references('users.id');
        table.integer('service_instance_id').references('service_instances.id').onDelete('cascade');


     */
    await create('account_charge', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.integer('payment_account_id').references('payment_account.id');
        table.boolean('approved').defaultTo(false);
        table.float('amount');
        table.string('currency').defaultTo('usd');
        table.string('description');
        table.bigInteger('period_start');
        table.bigInteger('period_end');
        table.timestamps(true, true);

    })

    /*

        table.string('line_item_id');
        table.boolean('livemode');


     */

    /*

     */
    await create('user_invoice_lines', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.integer('payment_account_id').references('payment_account.id');
        table.integer('invoice_id').references('user_invoices.id').onDelete('cascade');
        table.float('amount');
        table.string('currency');
        table.string('description');
        table.boolean('proration');
        table.integer('quantity');
        table.string('type');
        table.timestamps(true, true);

    });
    /*
            table.string('failure_code');
        table.string('failure_message');
        table.boolean('livemode');
        table.string('invoice');


     */
    /*
            table.integer('user_id').references('users.id');

     */
    await create('transactions', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.integer("fund_id").references("funds.id");
        table.integer('invoice_id').references('user_invoices.id').onDelete('cascade');
        table.string('charge_id');
        table.float('amount');
        table.boolean('refunded');
        table.float('amount_refunded');
        table.jsonb('refunds');
        table.boolean('captured');
        table.string('currency');
        table.string('dispute');
        table.boolean('paid');
        table.string('description');
        table.string('statement_descriptor');
        table.string('status');
        table.timestamps(true, true);

    });
    await create('user_upcoming_invoice', function (table) {
        table.increments();
        table.integer('user_id').references('users.id').onDelete('cascade');
        table.bigInteger('next_payment');
        table.jsonb('invoice_json');
        table.timestamps(true, true);
        console.log("Created 'user_upcoming_invoice' table.");

    });

    await create('payment_structure_template', function (table) {
        table.increments();
        table.float('amount');
        table.string('trial_period');
        table.string('statement_description');
        table.integer('cycles');
        table.string('interval');
        table.timestamps(true, true);

    });

    await create('payment_structure_instance', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.integer('payment_account_id').references('payment_account.id');
        table.integer('invoice_id').references('user_invoices.id').onDelete('cascade');
        table.float('amount');
        table.string('currency');
        table.string('description');
        table.boolean('proration');
        table.integer('quantity');
        table.string('type');
        table.timestamps(true, true);

    });


    await create('payment_account', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.integer("payment_provider_id").references("funds.id");

        table.integer("fund_id").references("funds.id");

        table.timestamps(true, true);

    });

    await create('payment_provider', function (table) {
        table.increments();
        table.jsonb("provider_data");
        table.jsonb("provider_config");
        table.string("name");
        table.timestamps(true, true);

    });


}