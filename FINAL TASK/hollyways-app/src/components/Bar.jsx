import ProgressBar from 'react-bootstrap/ProgressBar';
import '../css/ProgresBar.css'
import { useState } from 'react';
import { useQuery } from 'react-query';
import { API, setAuthToken } from '../config/api';

function WithLabelExample() {
  const now = 70;
  const [donated, setDonated] = useState([])
  const [attache, setAttache] = useState([])



  useQuery('donatedsCache', async () => {
    const response = await API.get('/donateds');
    setDonated(response.data.data)
  });

  const total = donated.reduce((prevValue, currentValue) => prevValue + currentValue.donated, 0);


  // console.log(total);




    // useQuery('attacheCache', async () => {
    //   const response = await API.get('/attache/' + index);
    //   setAttache(response.data.data)
    // });





  const persentage = (total / attache.donation) * 100

  console.log(persentage)







  return <ProgressBar variant="danger" className='progresBar' now={now} label={`${now}%`} />;
}

export default WithLabelExample;