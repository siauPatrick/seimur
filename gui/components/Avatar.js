import React from 'react';


export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.getImage = this.getImage.bind(this);
    this.replaceImg = this.replaceImg.bind(this);
    this.setExistingImg = this.setExistingImg.bind(this);
  }

  componentDidMount() {
    const {images} = this.props;
    this.setExistingImg(images);
  }

  state = {
    imgUri: '',
    defaultProfilePhotoUri: 'https://search.amazinghiring.com/static/img/default-profile-photo.svg'
  }

  getImage(imgUri) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(imgUri);
      img.onerror = () => reject();
      img.src = imgUri
    })
  }

  replaceImg(imgUri) {
    this.setState({imgUri})
  }

  setExistingImg(images) {
    const getImage = this.getImage;
    const replaceImg = this.replaceImg;

    const checkImg = () => {
      const imgUri = images.length ? images.shift() : this.state.defaultProfilePhotoUri;
      getImage(imgUri).then(replaceImg, checkImg)
    };
    checkImg();
  }

  render() {
    return (
      <div>
        <img src={this.state.imgUri}/>
      </div>
    )
  }
}
