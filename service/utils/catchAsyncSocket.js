const ckDefault = (err, payload) => {
  console.log(err);
};

module.exports = (fn) => {
  return (payload, callback) => {
    const ckFn = typeof callback === 'function' ? callback : ckDefault;
    fn(payload, ckFn).catch(ckFn);
  };
};
