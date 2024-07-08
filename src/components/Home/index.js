import {Link} from 'react-router-dom'

import './index.css'
import Header from '../Header'

const Home = () => {
  const demo = null
  return (
    <div className="homepage-bg">
      <Header />
      <div className="homepage-card">
        <h1 className="homepage-main-heading">
          Find The Job That Fits Your Life
        </h1>
        <p className="homepage-description">
          Millions of people are searching for jobs, salary information, company
          review. Find the job that fits your abilities and potential.
        </p>
        <Link to="jobs" className="link">
          <button type="button" className="find-job-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
