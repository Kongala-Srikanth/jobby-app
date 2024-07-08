import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobsData} = props
  const {
    employmentType,
    companyLogoUrl,
    id,
    title,
    jobDescription,
    location,
    rating,
    packagePerAnnum,
  } = jobsData

  return (
    <Link to={`/jobs/${id}`} className="link">
      <div className="job-page-post-card">
        <div className="job-page-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-page-role">{title}</h1>
            <p>
              <FaStar className="star-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="job-page-package-container">
          <div className="job-page-location-container">
            <p className="job-page-location">
              <MdLocationOn className="star-icon" />
              {location}
            </p>
            <p className="job-page-location">
              <BsBriefcaseFill className="star-icon" />
              {employmentType}
            </p>
          </div>
          <p className="job-page-package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="job-page-description-heading">Description</h1>
        <p className="job-page-description">{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobItem
