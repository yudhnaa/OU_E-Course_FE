// Custom styles for video players (YouTube and Google Drive)
export const youtubePlayerStyles = `
	.youtube-container {
		position: relative;
		overflow: hidden;
		max-height: 600px;
	}

	.youtube-container::before {
		content: '';
		display: block;
        padding-top: 56.25%; /* 16:9 aspect ratio */
	}

	.youtube-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100% !important;
		height: 100% !important;
		border: none;
	}

	.lesson-item.active {
		background-color: #f8f9fa;
		border-left: 4px solid #0d6efd;
	}

	.lesson-item:hover {
		background-color: #f8f9fa;
		cursor: pointer;
	}

	.navigation-panel {
		transition: all 0.3s ease-in-out;
	}

	.navigation-panel.collapsed {
		margin-right: -100%;
		width: 0;
		overflow: hidden;
	}

	.navigation-toggle {
		border: none;
		background: transparent;
		color: #6c757d;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease-in-out;
	}

	.navigation-toggle:hover {
		color: #0d6efd;
		background: transparent;
		border: none;
	}

	.navigation-toggle:focus {
		box-shadow: none;
		border: none;
		background: transparent;
	}

	.expand-button {
		position: fixed;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1000;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
		transition: all 0.3s ease-in-out;
	}

	.expand-button:hover {
		transform: translateY(-50%) scale(1.05);
		box-shadow: 0 4px 15px rgba(0,0,0,0.15);
	}

	@media (max-width: 991.98px) {
		.navigation-panel.collapsed {
			margin-right: 0;
			width: 100%;
			display: none;
		}
	}
`;
