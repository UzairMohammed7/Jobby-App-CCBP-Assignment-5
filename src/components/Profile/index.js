import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    apiProfileStatus: apiProfileStatusConstants.initial,
    profileData: [],
  }

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({apiProfileStatus: apiProfileStatusConstants.inProgress})
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
        apiProfileStatus: apiProfileStatusConstants.success,
        responseSuccess: true,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConstants.failure})
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
    <div className="profile-fail-container">
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

  renderProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.success:
        return this.renderProfileView()
      case apiProfileStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiProfileStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderProfileStatus()}</>
  }
}
export default Profile
