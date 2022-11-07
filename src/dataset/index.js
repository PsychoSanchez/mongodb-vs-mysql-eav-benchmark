const { faker } = require('@faker-js/faker');

faker.seed(123);

/**
 * @param {number} product_id
 */
function createDataset(product_id) {
    faker.setLocale(faker.random.locale())

    return {
        product_id: product_id,
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),

        sku: faker.datatype.number({ min: 1, max: 10 }),
        upc: faker.datatype.number({ min: 1, max: 10 }),
        ean: faker.datatype.number({ min: 1, max: 10 }),
        asin: faker.datatype.number({ min: 1, max: 10 }),
        gtin: faker.datatype.number({ min: 1, max: 10 }),
        mpn: faker.datatype.number({ min: 1, max: 10 }),


        age_restriction: faker.datatype.number({ min: 18, max: 99 }),
        product: faker.commerce.product(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        adjective: faker.commerce.productAdjective(),

        color: faker.color.human(),
        material: faker.commerce.productMaterial(),
        image_url: faker.image.avatar(),

        pallet_length: faker.datatype.number({ min: 1, max: 10 }),
        pallet_width: faker.datatype.number({ min: 1, max: 10 }),
        pallet_height: faker.datatype.number({ min: 1, max: 10 }),
        pallet_weight: faker.datatype.number({ min: 1, max: 10 }),
        pallet_quantity: faker.datatype.number({ min: 1, max: 10 }),

        box_length: faker.datatype.number({ min: 1, max: 10 }),
        box_width: faker.datatype.number({ min: 1, max: 10 }),
        box_height: faker.datatype.number({ min: 1, max: 10 }),
        box_weight: faker.datatype.number({ min: 1, max: 10 }),
        box_quantity: faker.datatype.number({ min: 1, max: 10 }),

        item_length: faker.datatype.number({ min: 1, max: 10 }),
        item_width: faker.datatype.number({ min: 1, max: 10 }),
        item_height: faker.datatype.number({ min: 1, max: 10 }),
        item_weight: faker.datatype.number({ min: 1, max: 10 }),
        item_quantity: faker.datatype.number({ min: 1, max: 10 }),

        price: faker.commerce.price(),
        currency: faker.finance.currencyCode(),
        currency_symbol: faker.finance.currencySymbol(),
        currency_name: faker.finance.currencyName(),
        price_tag: faker.finance.amount(),
        price_margin: faker.finance.amount(),
        price_discount: faker.finance.amount(),
        price_tax: faker.finance.amount(),
        price_shipping: faker.finance.amount(),
        price_shipping_tax: faker.finance.amount(),
        price_total: faker.finance.amount(),

        department: faker.commerce.department(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.address.street(),
        company: faker.company.name(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),

        ram_size: faker.datatype.number({ min: 1, max: 10 }),
        ram_type: faker.datatype.number({ min: 1, max: 10 }),
        ram_speed: faker.datatype.number({ min: 1, max: 10 }),
        ram_ecc: faker.datatype.number({ min: 1, max: 10 }),
        ram_registered: faker.datatype.number({ min: 1, max: 10 }),
        ram_latency: faker.datatype.number({ min: 1, max: 10 }),
        ram_voltage: faker.datatype.number({ min: 1, max: 10 }),
        ram_heat_spreader: faker.datatype.number({ min: 1, max: 10 }),
        ram_color: faker.datatype.number({ min: 1, max: 10 }),
        ram_module: faker.datatype.number({ min: 1, max: 10 }),

        fan_rpm: faker.datatype.number({ min: 1, max: 10 }),
        fan_airflow: faker.datatype.number({ min: 1, max: 10 }),
        fan_noise: faker.datatype.number({ min: 1, max: 10 }),
        fan_color: faker.datatype.number({ min: 1, max: 10 }),
        fan_led: faker.datatype.number({ min: 1, max: 10 }),
        fan_pump: faker.datatype.number({ min: 1, max: 10 }),
        fan_radiator: faker.datatype.number({ min: 1, max: 10 }),
        fan_cooler: faker.datatype.number({ min: 1, max: 10 }),
        fan_cooler_type: faker.datatype.number({ min: 1, max: 10 }),
        fan_cooler_socket: faker.datatype.number({ min: 1, max: 10 }),

        manufacturer: faker.company.name(),
        model: faker.commerce.productName(),
        serial: faker.datatype.number({ min: 1, max: 10 }),
        part_number: faker.datatype.number({ min: 1, max: 10 }),

        is_active: faker.datatype.boolean(),
        is_featured: faker.datatype.boolean(),
        is_new: faker.datatype.boolean(),
        is_hot: faker.datatype.boolean(),
        is_sold: faker.datatype.boolean(),
        is_available: faker.datatype.boolean(),
        is_preorder: faker.datatype.boolean(),
        is_out_of_stock: faker.datatype.boolean(),
        is_in_stock: faker.datatype.boolean(),
        is_backorder: faker.datatype.boolean(),
        is_virtual: faker.datatype.boolean(),
    };
}

module.exports = {
    createDataset,
};