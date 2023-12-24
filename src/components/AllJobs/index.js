import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
// import {BsSearch} from 'react-icons/bs'

import JobsRoute from '../JobsRoute'
import Header from '../Header'
import './index.css'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    apiJobStatus: apiJobStatusConstants.initial,
    apiStatus: apiStatusConstants.initial,
    jobsData: [],
    profileData: {},
    checkBoxInputs: [],
    searchInput: '',
    radioInput: '',
  }

  componentDidMount() {
    this.getJobsData()
    this.getProfileData()
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, checkBoxInputs, radioInput} = this.state
    const checkBox = checkBoxInputs.join(',')
    const JobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBox}&minimum_package=${radioInput}&search=${searchInput}`
    const jobsOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobResponse = await fetch(JobsApiUrl, jobsOptions)
    if (jobResponse.ok === true) {
      const fetchJobData = await jobResponse.json()
      const updatedJobData = fetchJobData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: updatedJobData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiJobStatusConstants.failure,
      })
    }
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(profileApiUrl, profileOptions)
    if (profileResponse.ok === true) {
      const fetchProfileData = [await profileResponse.json()]
      const updateProfileData = fetchProfileData.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))

      this.setState({
        profileData: updateProfileData,
        apiStatus: apiStatusConstants.success,
        responseSuccess: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, shortBio, profileImageUrl} = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryFailure = () => {
    this.getProfileData()
  }

  renderProfileFailureView = () => (
    <div className="profile-container">
      <h1>profile Fail</h1>
      <button
        type="button"
        className="failure-btn"
        onClick={this.onRetryFailure}
      >
        Retry
      </button>
    </div>
  )

  getCheckboxInputs = event => {
    const {checkBoxInputs} = this.state
    const checkedInputNotInList = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (checkedInputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filterCheckedInput = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkBoxInputs: filterCheckedInput}),
        this.getJobsData,
      )
    }
  }

  onGetCheckboxView = () => (
    <ul>
      {employmentTypesList.map(eachType => (
        <li className="checkbox-list" key={eachType.employmentTypeId}>
          <input
            onChange={this.getCheckboxInputs}
            id={eachType.employmentTypeId}
            type="checkbox"
          />
          <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
        </li>
      ))}
    </ul>
  )

  getRadioOptions = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  onGetRadioButtonView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li className="radio-items-list" key={eachItem.salaryRangeId}>
          <input
            onChange={this.getRadioOptions}
            type="radio"
            name="option"
            id={eachItem.salaryRangeId}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsViewList = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(eachJob => (
          <JobsRoute key={eachJob.id} eachJobData={eachJob} />
        ))}
      </ul>
    )
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  renderJobFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="job-retry" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsStatus = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsViewList()
      case apiJobStatusConstants.failure:
        return this.renderJobFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onClickSearch = () => {
    this.getJobsData()
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {checkBoxInputs, radioInput, searchInput} = this.state
    return (
      <>
        <Header />
        <div className="profile-and-job-container">
          <div>
            {this.renderProfileStatus()}
            <hr />
            <h1 className="emp-type-heading">Type of Employment</h1>
            {this.onGetCheckboxView()}
            <hr />
            <h1 className="salary-heading">Salary Range</h1>
            {this.onGetRadioButtonView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                placeholder="search"
                type="search"
                className="input"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <AiOutlineSearch />.
              </button>
              {/* <button type="button">
              <BsSearch className="search-icon" />.
              </button> */}
            </div>
            {this.renderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
