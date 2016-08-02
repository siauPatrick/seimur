import React from 'react';


export default class Avatar extends React.Component {
  state = {
    imageUri: ''
  }

  defaultImageUri = '/static/default_avatar.svg';

  componentDidMount = () => {
    const {images} = this.props;
    this.setExistingImage(images);
  }

  getImage = (imageUri) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(imageUri);
      image.onerror = reject;
      image.src = imageUri;
    })
  }

  setImageUri = (imageUri) => {
    this.setState({imageUri});
  }

  setExistingImage = (images) => {
    const checkImage = () => {
      const imgUri = images.length ? images.shift() : this.defaultImageUri;
      this.getImage(imgUri).then(this.setImageUri, checkImage);
    };
    checkImage();
  }

  render() {
    return (
      <div>
        <img src={this.state.imageUri}/>
      </div>
    )
  }
}
