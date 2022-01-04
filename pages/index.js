import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import ReactLoading from 'react-loading';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

const EventSource = NativeEventSource || EventSourcePolyfill;

export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(['']);

  const Loader = () => (
    <ReactLoading type='bars' color='#00aaff' height={275} width={275} />
  );

  const generateTemplate = async event => {
    setLoading(true);
    event.preventDefault();
    setTemplate(['']);
    
    const events = new EventSource(`${window.location.href + 'api?description='}`+ encodeURIComponent(description));
    events.onmessage = (result) => {
      setLoading(false);
      try {
        if (result && result.data && result.data.length > 0 && result.data !== '"""') {
          if (result.data.includes('[DONE]')) {
            events.end();
            setLoading(false);
          }
          else {
            setTemplate(template => [...template, result.data]);
          }
        }
      }
      catch(e){events.close();setLoading(false);}
    };
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
            template && template.length > 0 
            ?
            <>
              <pre>
                {template.join('\n')}
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
