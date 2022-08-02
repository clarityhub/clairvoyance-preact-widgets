import xhr from 'xhr';

export const getPlans = (success, failure) => {
  xhr({
    method: 'get',
    // TODO not ideal, we should inject this from main
    url: `${process.env.REACT_APP_API_URL}/billing/plans`,
    headers: {
      'Content-Type': 'application/json',
    },
  }, (err, resp, body) => {
    if (err || resp.statusCode >= 400) {
      failure(err, resp);
    } else {
      success(resp, body);
    }
  });
};
