import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {RiExternalLinkFill} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const jobStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class JobDetails extends Component {
  state = {
    similar: [],
    jobDetails: {},
    skills: [],
    aboutCompany: {},
    jobDataStatus: jobStatus.inProgress,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({jobDataStatus: jobStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const newJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const requiredSkills = data.job_details.skills.map(each => ({
        imageUrlSkill: each.image_url,
        name: each.name,
      }))

      const aboutCompany = {
        description: data.job_details.life_at_company.description,
        imageUrlCompany: data.job_details.life_at_company.image_url,
      }

      const relatedJobs = data.similar_jobs.map(each => ({
        companyLogoUrlSimilar: each.company_logo_url,
        employmentTypeSimilar: each.employment_type,
        id: each.id,
        jobDescriptionSimilar: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        similar: relatedJobs,
        jobDetails: newJobDetails,
        skills: requiredSkills,
        aboutCompany,
        jobDataStatus: jobStatus.success,
      })
    } else {
      this.setState({jobDataStatus: jobStatus.failure})
    }
  }

  renderSuccess = () => {
    const {similar, jobDetails, skills, aboutCompany} = this.state
    const {description, imageUrlCompany} = aboutCompany
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      rating,
      location,
      packagePerAnnum,
      title,
    } = jobDetails
    return (
      <div className="job-details-bg-container ">
        <Header />
        <div className="space-container">
          <div className="job-page-post-card">
            <div className="job-page-logo-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
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
            <div className="visit-container">
              <h1 className="skill-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                className="visit-link"
                rel="noreferrer"
              >
                Visit
                <RiExternalLinkFill className="link-icon" />
              </a>
            </div>

            <p className="job-page-description">{jobDescription}</p>
            <h1 className="skill-heading">Skills</h1>
            <ul className="skills-container">
              {skills.map(each => (
                <li key={each.name} className="each-skill-container">
                  <img
                    src={each.imageUrlSkill}
                    alt={each.name}
                    className="skill-img"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-container">
              <div className="life-at-company-para-container">
                <h1 className="job-page-description-heading">
                  Life at Company
                </h1>
                <p className="job-page-description">{description}</p>
              </div>
              <img src={imageUrlCompany} alt="" className="company-img" />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similar.map(each => (
              <li key={each.id} className="similar-job-card">
                <Link to={`/jobs/${each.id}`} className="link">
                  <div className="job-page-logo-container">
                    <img
                      src={each.companyLogoUrlSimilar}
                      alt="similar job company logo"
                      className="company-logo"
                    />
                    <div>
                      <h1 className="job-page-role">{each.title}</h1>
                      <p>
                        <FaStar className="star-icon" />
                        {each.rating}
                      </p>
                    </div>
                  </div>

                  <h1 className="job-page-description-heading">Description</h1>

                  <p className="job-page-description">
                    {each.jobDescriptionSimilar}
                  </p>

                  <div className="job-page-location-container">
                    <p className="job-page-location">
                      <MdLocationOn className="star-icon" />
                      {each.location}
                    </p>
                    <p className="job-page-location">
                      <BsBriefcaseFill className="star-icon" />
                      {each.employmentTypeSimilar}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailure = () => (
    <>
      <Header />
      <div className="job-details-bg-container page-error-container-position">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="job-page-failure-view"
          />
          <h1 className="page-error-heading">Oops! Something Went Wrong</h1>
          <p className="page-error-text">
            We cannot seem to find the page you are looking for.
          </p>
          <div className="btn-container">
            <button
              type="button"
              className="profile-error-btn"
              onClick={this.getJobData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderResult = () => {
    const {jobDataStatus} = this.state

    switch (jobDataStatus) {
      case jobStatus.success:
        return this.renderSuccess()
      case jobStatus.failure:
        return this.renderFailure()
      case jobStatus.inProgress:
        return this.renderLoading()
    }
  }

  render() {
    return this.renderResult()
  }
}

export default JobDetails
