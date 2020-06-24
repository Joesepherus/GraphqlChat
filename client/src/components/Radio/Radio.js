// LIBRARIES
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS

/**
 * Radio component
 * @param {func} onChange -  The function that fires when user selects a radio button
 * @param {string} value - The value of the Radio
 * @param {array} options - Array of different radio buttons to be displayed, each has to have value and a label
 * @param {string} name - Name of the Radio
 */
const CustomRadio = (props) => {
	const { onChange, value, options, name } = props;

	return (
		<FormControl component="fieldset">
			<RadioGroup name={name} value={value} onChange={(event) => onChange(event.target.value)}>
				{options.map((option, index) => (
					<FormControlLabel
						key={index}
						value={option.value}
						control={<Radio color="primary" />}
						label={option.label}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default CustomRadio;

CustomRadio.propTypes = {
	value: PropTypes.string.isRequired,
	name: PropTypes.string,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func,
};

CustomRadio.defaultProps = {
	value: 'selectedValue',
	name: 'select',
	options: [],
	onChange: () => console.log('CustomRadio default onChange function'),
};
