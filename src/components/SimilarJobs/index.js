import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase} from 'react-icons/fa'

import './index.css'

const SimilarJobs = props => {
  const {similarJobsDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
    // eslint-disable-next-line no-unused-vars
    id,
  } = similarJobsDetails
  return (
    <li className="similar-jobs-list">
      <div className="similar-jobs-container">
        <div className="img-title-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-img-url"
          />
          <div className="title-rating-container">
            <h1 className="similar-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="second-part-container">
          <h1 className="similar-desc-heading">Description</h1>
          <p className="similar-desc">{jobDescription}</p>
        </div>
        <div className="sim-location-job-type-container">
          <div className="sim-location-container">
            <MdLocationOn />
            <p>{location}</p>
          </div>
          <div className="sim-job-type-container">
            <FaBriefcase />
            <p>{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
