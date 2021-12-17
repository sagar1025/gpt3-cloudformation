import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import ReactLoading from 'react-loading';


export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const Loader = () => (
    <ReactLoading type='bars' color='#00aaff' height={275} width={275} />
);

  const generateTemplate = async event => {
    try {
      event.preventDefault();
      setLoading(true);
      const res = await fetch('/api/hello', {
        body: JSON.stringify({
          description: description
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
  
      const result = await res.json();
      console.log(result)
      setLoading(false);
    }
    catch(e){
      setLoading(false);
    }

  }


  return (
    <Layout home>
      {loading
      ?
      Loader()
      :
      <div className={styles.flex}>
        <div className={styles.formWrapper}>
          <form onSubmit={generateTemplate} method='POST'>
            <label htmlFor="description" className={styles.label} >Enter the AWS resources you would like to create:</label>
            <input id="description" name="description" type="text" autoComplete="name" required className={styles.searchbar} onChange={(e) => { setDescription(e.target.value); }} />
            <button type="submit" className={styles.btn}>Generate</button>
          </form>
        </div>

        <div className={styles.result}>
        </div>
      </div>
      }

    </Layout>

  )
}
