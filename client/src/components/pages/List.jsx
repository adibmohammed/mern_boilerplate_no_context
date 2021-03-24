import React, { Component } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

class List extends Component {
	state = {
		streetArts: []
	};

	componentDidMount() {
		api
			.getSteetArts()
			.then((data) => {
				this.setState({ streetArts: data });
			})
			.catch((err) => console.log(err));
	}

	render() {
		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>Picture</th>
							<th>Google Maps Direction</th>
							<th>Detail</th>
						</tr>
					</thead>
					<tbody>
						{this.state.streetArts.map((art) => {
							return (
								<tr key={art._id}>
									<td>
										<img src={art.pictureUrl} alt="meaningful" style={{ width: '50px' }} />
									</td>
									<td>
										<Link
											to={`https://www.google.com/maps/dir//${art.location.coordinates[0]}/@${art
												.location.coordinates[1]}`}
										>
											Direction
										</Link>
									</td>
									<td>
										<button>
											<Link to={`/street-art-detail/${art._id}`}>Detail</Link>
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default List;
