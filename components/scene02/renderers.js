import React, { PureComponent } from "react";
import { StyleSheet, View, LayoutAnimation } from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import * as Animatable from "react-native-animatable";

const BODY_DIAMETER = 50;
const BORDER_WIDTH = 5;
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];
const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];

class Worm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			ready: false
		};
	}

	onReady = () => {
		this.setState({
			ready: true
		});
	};

	componentWillUnmount() {
		var CustomLayoutSpring = {
			duration: 900,
			delete: {
				type: LayoutAnimation.Types.spring,
				property: LayoutAnimation.Properties.opacity,
				springDamping: 0.4
			}
		};
		LayoutAnimation.configureNext(CustomLayoutSpring);
	}

	render() {
		const x = this.props.position[0] - BODY_DIAMETER / 2;
		const y = this.props.position[1] - BODY_DIAMETER / 2;
		return (
			<View>

				<StaggeredMotion
					defaultStyles={[
						{ left: x, top: y },
						{ left: x, top: y },
						{ left: x, top: y },
						{ left: x, top: y }
					]}
					styles={prevInterpolatedStyles =>
						prevInterpolatedStyles.map((_, i) => {
							return i === 0
								? {
										left: spring(x),
										top: spring(y)
									}
								: {
										left: spring(
											prevInterpolatedStyles[i - 1].left
										),
										top: spring(
											prevInterpolatedStyles[i - 1].top
										)
									};
						})}
				>
					{interpolatingStyles => (
						<View
							style={[
								css.anchor,
								{ opacity: this.state.ready ? 1 : 0 }
							]}
						>
							{interpolatingStyles.map((style, i) => (
								<View
									key={i}
									style={[
										css.body,
										{
											left: style.left,
											top: style.top,
											backgroundColor: COLORS[i],
											width: BODY_DIAMETER - i * 5,
											height: BODY_DIAMETER - i * 5,
											zIndex: 0 - i
										}
									]}
								/>
							))}
						</View>
					)}
				</StaggeredMotion>

				<Animatable.View
					animation="bounceIn"
					easing={"ease-in-out-cubic"}
					useNativeDriver={true}
					style={[css.head, { left: x, top: y }]}
					onAnimationEnd={this.onReady}
				/>

			</View>
		);
	}
}

const css = StyleSheet.create({
	body: {
		borderColor: "#FFF",
		borderWidth: BORDER_WIDTH,
		width: BODY_DIAMETER,
		height: BODY_DIAMETER,
		position: "absolute",
		borderRadius: BODY_DIAMETER * 2
	},
	anchor: {
		position: "absolute"
	},
	head: {
		backgroundColor: "#FF5877",
		borderColor: "#FFC1C1",
		borderWidth: BORDER_WIDTH,
		width: BODY_DIAMETER,
		height: BODY_DIAMETER,
		position: "absolute",
		borderRadius: BODY_DIAMETER * 2
	}
});

export { Worm };
