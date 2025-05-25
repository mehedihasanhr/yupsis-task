// Exchange calculation for mutki and mojo
const exChangeRate = 3; // 1 mojo = 3 mutki

function calculateExchange(initialMojo = 10) {
  let totalConsumedMojo = initialMojo;
  let mutki = initialMojo;
  let mojo = initialMojo;

  if (initialMojo <= 0) {
    return { mojo: 0, mutki: 0 };
  }

  while (mutki >= exChangeRate) {
    const exchangedMojo = Math.floor(mutki / exChangeRate);

    mojo += exchangedMojo;
    totalConsumedMojo += exchangedMojo;

    mutki -= exchangedMojo * exChangeRate;
    mutki += exchangedMojo;
  }

  return { mojo: totalConsumedMojo, mutki };
}

/************************************** */
/************************************** */
/* TEST CASE */
/************************************** */
/************************************** */

function assertEqual(actual, expected, message) {
  const actualString = JSON.stringify(actual);
  const expectedString = JSON.stringify(expected);
  if (actualString === expectedString) {
    console.log(`✅ Passed`);
    console.log(`   ${message}`);
    console.log(`   Expected: ${expectedString}`);
    console.log(`   Actual:   ${actualString} \n`);
  } else {
    console.error(`❌ ${message}`);
    console.error(`   Expected: ${expectedString}`);
    console.error(`   Actual:   ${actualString} \n`);
  }
}

class TestCase {
  constructor(description, initialMojo, expected) {
    this.description = description;
    this.initialMojo = initialMojo;
    this.expected = expected;

    this.run = function () {
      const result = calculateExchange(this.initialMojo);
      assertEqual(result, this.expected, this.description);
    };

    this.run();
  }
}

new TestCase("Initial Mojo 10", 10, { mojo: 14, mutki: 2 });
new TestCase("Initial Mojo 0", 0, { mojo: 0, mutki: 0 });
new TestCase("Initial Mojo 5", 5, { mojo: 7, mutki: 1 });
new TestCase("Initial Mojo 15", 15, { mojo: 22, mutki: 1 });
new TestCase("Initial Mojo 20", 20, { mojo: 29, mutki: 2 });
