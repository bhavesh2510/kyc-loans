const KycSuccess = () => {
  return (
    <>
      <div className='card'>
        <div
          style={{
            borderRadius: '200px',
            height: '200px',
            width: '200px',
            background: '#eeecfb',
            margin: '0 auto',
          }}
        >
          <i className='i-for-kycsuccess checkmark'>✓</i>
        </div>
        <br />
        <h3 className='heading-for-kycsuccess'>
          You have successfully completed
        </h3>
        <h3 className='heading-for-kycsuccess' style={{ textAlign: 'center' }}>
          KYC process!
        </h3>
      </div>
    </>
  );
};
export default KycSuccess;
