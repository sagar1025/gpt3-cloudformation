import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import ReactLoading from 'react-loading';


export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('');

  const Loader = () => (
    <ReactLoading type='bars' color='#00aaff' height={275} width={275} />
);

  const generateTemplate = async event => {
    try {
      event.preventDefault();
      setLoading(true);
      const res = await fetch('/api/getCFTemplate', {
        body: JSON.stringify({
          description: 'Create a ' + description
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
  
      const result = await res.json();
      //console.log(result);
      if(result && result.template && result.template.length > 0) {
        setTemplate(result.template);
      }
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
            <p>Be specific about the instance types and other custom specifications you would like. Examples: </p>
            <p>Create a new RDS with AuroraDB of size 2GB</p>
            <p>Create a static website hosted on S3 and served on Amazon CloudFront</p>
            <span>Create a </span><input id="description" name="description" type="text" autoComplete="name" required className={styles.searchbar} onChange={(e) => { setDescription(e.target.value); }} />
            <button type="submit" className={styles.btn}>Generate</button>
          </form>
        </div>

        <div className={styles.result}>
          {
            template.length > 0 
            ?
            <>
              <pre>
                {template}
              </pre>
            </>
            :
            <></>
          }
        </div>
      </div>
      }

    </Layout>

  )
}
