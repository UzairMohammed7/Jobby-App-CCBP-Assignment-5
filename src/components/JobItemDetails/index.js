import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import {FaBriefcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobsItemData: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.initial})

    const jwtToken = Cookies.get('jwt_token')
    const JobsDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobDetailsResponse = await fetch(JobsDetailsApiUrl, options)
    if (jobDetailsResponse.ok === true) {
      const fetchJobItemData = await jobDetailsResponse.json()
      const updatedJobItemData = [fetchJobItemData.job_details].map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          companyWebsiteUrl: eachItem.company_website_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          skills: eachItem.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          lifeAtCompany: {
            description: eachItem.life_at_company.description,
            imageUrl: eachItem.life_at_company.image_url,
          },
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      const updatedSimilarJobsData = fetchJobItemData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          jobDescription: eachItem.job_description,
          id: eachItem.id,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      this.setState({
        jobsItemData: updatedJobItemData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobItemSuccessView = () => {
    const {jobsItemData, similarJobsData} = this.state
    if (jobsItemData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        // eslint-disable-next-line no-unused-vars
        id,
        jobDescription,
        skills,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        title,
      } = jobsItemData[0]
      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company-img-url"
                />
                <div className="title-rating-container">
                  <h1 className="title-head">{title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="rating-star" />
                    <p className="rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-container">
                    <MdLocationOn />
                    <p>{location}</p>
                  </div>
                  <div className="job-type-container">
                    <FaBriefcase />
                    <p>{employmentType}</p>
                  </div>
                </div>
                <div>
                  <p>{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="hr" />
            <div className="second-part-container">
              <div className="head-and-link">
                <h1 className="desc-heading">Description</h1>
                <a className="href" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="desc">{jobDescription}</p>
            </div>
            <h1 className="skills-head">Skills</h1>
            <ul className="skills-list">
              {skills.map(eachItem => (
                <li className="skills-list-type" key={eachItem.name}>
                  <img
                    className="skill-img"
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                  />
                  <p>{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <div className="lifeAtCompany-container">
              <div className="lifeAtCompany-text">
                <h1>Life at Company</h1>
                <p className="lifeAtCompany-desc">
                  {lifeAtCompany.description}
                </p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobsData.map(eachItem => (
              <SimilarJobs
                key={eachItem.id}
                similarJobsDetails={eachItem}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onRetryJobs = () => {
    this.getJobItemDetails()
  }

  renderJobItemFailureView = () => (
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

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobItemStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">
          {this.renderJobItemStatus()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
