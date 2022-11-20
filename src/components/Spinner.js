const Spinner = () => {
  return (
    <div className='container text-center mt-3'>
      <div
        className='spinner-border'
        role='status'
        style={{ width: '100px', height: '100px' }}
      >
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
