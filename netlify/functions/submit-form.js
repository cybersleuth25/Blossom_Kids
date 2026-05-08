exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error('Missing required environment variable: WEB3FORMS_ACCESS_KEY');
      return {
        statusCode: 503,
        body: JSON.stringify({
          success: false,
          message: 'Service unavailable: WEB3FORMS_ACCESS_KEY is not configured',
        }),
      };
    }

    // Append the access_key from environment variable
    formData.access_key = accessKey;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  }
};
