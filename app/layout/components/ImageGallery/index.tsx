import React from 'react';
import './ImageViewer.css';

const ImageViewerComponent: React.FC = () => {
	const imageNames = [
		'Arabesque.webp',
		'Ebroker.webp',
		'Foxstudio.webp',
		'Gonka.webp',
		'IPM.webp',
		'OpinionFromUs.webp',
		'OptimProject.webp',
		'Powerkebab-min.webp',
		'Sano.webp',
		'Spectrum.webp',
		'SPhancesti.webp',
	];


	return (
		<div className="image-gallery">
			{imageNames.map((imageName, index) => (
				<div
					className="image-container"
					key={index}
				>
					<div className="image"
              key={ index }
              style={{ backgroundImage: `url(images/w/${imageName})` }}>
			</div>
				</div>
			))}
		</div>
	);
};

export default ImageViewerComponent;
