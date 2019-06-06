const request = require('request');
const custData = require('./convertedCSV');
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

function loadCustomerData(data) {
  data.forEach(customer => {
    const options = {
      method: 'POST',
      url: 'https://api.kustomerapp.com/v1/customers',
      headers: {
        'content-type': 'application/json',
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZjdmNTE0OTkyNDY1MDA4ZjQyOWZhZCIsInVzZXIiOiI1Y2Y3ZjUxNDY3YmMzZTAwMTM0MWQ3ZjciLCJvcmciOiI1Y2Y2YTk2MjEyMjI3OTAwMTJlNDFlYjAiLCJvcmdOYW1lIjoienp6LWthdGllZyIsInVzZXJUeXBlIjoibWFjaGluZSIsInJvbGVzIjpbIm9yZy5hZG1pbiIsIm9yZy51c2VyIl0sImV4cCI6MTU2MDM1ODgwMywiYXVkIjoidXJuOmNvbnN1bWVyIiwiaXNzIjoidXJuOmFwaSIsInN1YiI6IjVjZjdmNTE0NjdiYzNlMDAxMzQxZDdmNyJ9._yHEeajdiFkQ5eVjKROawaxM3mDVPSsFc3oRb4mbNto',
      },
      body: {
        name: customer.firstName + ' ' + customer.lastName,
        emails: [{ email: customer.email }],
        phones: [],
        birthdayAt: new Date(customer.birthday),
        tags: [],
      },
      json: true,
    };
    if (customer.customerType.length >= 1) {
      options.body.tags.push(customer.customerType);
    }
    if (customer.workPhone.length > 1) {
      options.body.phones.push({
        type: 'work',
        phone: phoneUtil.format(
          phoneUtil.parse(customer.workPhone, 'US'),
          PNF.E164
        ),
      });
    }

    if (customer.homePhone.length > 1) {
      options.body.phones.push({
        type: 'home',
        phone: phoneUtil.format(
          phoneUtil.parse(customer.homePhone, 'US'),
          PNF.E164
        ),
      });
    }
    request(options, function(error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  });
}

loadCustomerData(custData);
