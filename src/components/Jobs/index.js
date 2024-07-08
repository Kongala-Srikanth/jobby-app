import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'

import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const userProfileStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

const jobStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
  noData: 'NO DATA',
}

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    userProfileDetails: {},
    userProfileError: userProfileStatus.inProgress,
    fullTime: false,
    partTime: false,
    freelance: false,
    internship: false,
    salaryPackage: '0',
    searchText: '',
    jobsData: [],
    jobDataStatus: jobStatus.inProgress,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsData()
  }

  getProfile = async () => {
    this.setState({userProfileError: userProfileStatus.inProgress})
    // const jwtToken = JSON.parse(Cookies.get('jwt_token'))
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        userProfileDetails: profileDetails,
        userProfileError: userProfileStatus.success,
      })
    } else {
      this.setState({userProfileError: userProfileStatus.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobDataStatus: jobStatus.inProgress})
    const {
      fullTime,
      partTime,
      internship,
      searchText,
      salaryPackage,
      freelance,
    } = this.state
    const jobFilterObject = [
      {
        id: 'PARTTIME',
        status: partTime,
      },
      {
        id: 'FULLTIME',
        status: fullTime,
      },
      {
        id: 'INTERNSHIP',
        status: internship,
      },
      {
        id: 'FREELANCE',
        status: freelance,
      },
    ]

    const employmentTypeFilter = []
    jobFilterObject.map(
      each => each.status && employmentTypeFilter.push(each.id),
    )

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeFilter.join()}&minimum_package=${salaryPackage}&search=${searchText}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const newJob = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      if (data.total !== 0) {
        this.setState({jobDataStatus: jobStatus.success, jobsData: newJob})
      } else {
        this.setState({jobDataStatus: jobStatus.noData})
      }
    } else {
      this.setState({jobDataStatus: jobStatus.failure})
    }

    // const data = await response.json()
    // console.log(data)
  }

  onEmploymentTypesFilter = id => {
    if (id === 'FULLTIME') {
      this.setState(
        prevState => ({fullTime: !prevState.fullTime}),
        this.getJobsData,
      )
    } else if (id === 'PARTTIME') {
      this.setState(
        prevState => ({partTime: !prevState.partTime}),
        this.getJobsData,
      )
    } else if (id === 'FREELANCE') {
      this.setState(
        prevState => ({freelance: !prevState.freelance}),
        this.getJobsData,
      )
    } else if (id === 'INTERNSHIP') {
      this.setState(
        prevState => ({internship: !prevState.internship}),
        this.getJobsData,
      )
    }
  }

  onSearchJob = event => {
    this.setState({searchText: event.target.value}, this.getJobsData)
  }

  onSearchButton = () => {
    // filter the jobs when search button clicked call the filter function
  }

  onSalaryFilter = id => this.setState({salaryPackage: id}, this.getJobsData)

  checkBoxContainer = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="checkbox-container">
        {employmentTypesList.map(each => (
          <li className="checkbox-each-list" key={each.employmentTypeId}>
            <input
              type="checkbox"
              id={each.employmentTypeId}
              onClick={() =>
                this.onEmploymentTypesFilter(each.employmentTypeId)
              }
            />
            <label className="label-text" htmlFor={each.employmentTypeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
      <hr />
    </>
  )

  radioContainer = () => (
    <>
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="checkbox-container">
        {salaryRangesList.map(each => (
          <li className="checkbox-each-list" key={each.salaryRangeId}>
            <input
              type="radio"
              id={each.salaryRangeId}
              name="salaryRange"
              onChange={() => this.onSalaryFilter(each.salaryRangeId)}
            />
            <label className="label-text" htmlFor={each.salaryRangeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  searchContainer = () => {
    const {searchText} = this.state
    return (
      <div className="search-container">
        <input
          type="search"
          placeholder="search"
          onChange={this.onSearchJob}
          value={searchText}
          className="search-box"
        />
        <button
          type="button"
          className="hide-btn search-btn"
          data-testid="searchButton"
          onClick={this.onSearchButton}
        >
          <FaSearch className="search-icon" />
        </button>
      </div>
    )
  }

  profileContainerCard = () => {
    const {userProfileError, userProfileDetails} = this.state

    return (
      <>
        {userProfileError === userProfileStatus.success && (
          <>
            <div className="profile-details-card">
              <img
                src={userProfileDetails.profileImageUrl}
                alt="profile"
                className="profile-img"
              />
              <h1 className="user-name">{userProfileDetails.name}</h1>
              <p className="user-role">{userProfileDetails.shortBio}</p>
            </div>
            <hr />
          </>
        )}
        {userProfileError === userProfileStatus.failure && (
          <>
            <div className="profile-error-container">
              <button
                type="button"
                className="profile-error-btn"
                onClick={this.getProfile}
              >
                Try Again
              </button>
            </div>

            <hr />
          </>
        )}
        {userProfileError === userProfileStatus.inProgress && (
          <>
            <div className="profile-error-container">
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            </div>

            <hr />
          </>
        )}
      </>
    )
  }

  jobsContainer = () => {
    const {jobsData} = this.state
    return jobsData.map(each => <JobItem key={each.id} jobsData={each} />)
  }

  jobConnectionFailure = () => (
    <div className="error-page-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-page-failure-view"
      />
      <h1 className="page-error-heading">Oops! Something Went Wrong</h1>
      <p className="page-error-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="profile-error-btn"
        onClick={this.getJobsData}
      >
        Retry
      </button>
    </div>
  )

  noJobsData = () => (
    <div className="error-page-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-page-failure-view"
      />
      <h1 className="page-error-heading">No Jobs Found</h1>
      <p className="page-error-text">
        We could not find jobs. Try other filters.
      </p>
    </div>
  )

  jobsDataLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsData = () => {
    const {jobDataStatus} = this.state

    switch (jobDataStatus) {
      case jobStatus.success:
        return this.jobsContainer()
      case jobStatus.failure:
        return this.jobConnectionFailure()

      case jobStatus.noData:
        return this.noJobsData()
      case jobStatus.inProgress:
        return this.jobsDataLoading()
    }
  }

  render() {
    const {userProfileError, searchText} = this.state

    return (
      <div className="jobs-page-bg-container">
        <Header />
        <div className="jobs-page-main-container">
          <div className="filter-container">
            <div className="sm-search-container">{this.searchContainer()}</div>

            {this.profileContainerCard()}
            {this.checkBoxContainer()}
            {this.radioContainer()}
          </div>

          <div className="all-post-container">
            <div className="lg-search-container">{this.searchContainer()}</div>
            {this.renderJobsData()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
