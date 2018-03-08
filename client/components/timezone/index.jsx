/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, flatMap, noop } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import QueryTimezones from 'components/data/query-timezones';
import { getRawOffsets, getTimezones, getTimezonesLabel } from 'state/selectors';
import SelectDropdown from 'components/select-dropdown';
import DropdownItem from 'components/select-dropdown/item';
import DropdownLabel from 'components/select-dropdown/label';
import DropdownSeparator from 'components/select-dropdown/separator';

class Timezone extends Component {
	onSelect = option => {
		this.props.onSelect( option.value );
	};

	getTimezonesByContinent() {
		return flatMap( this.props.timezones, timezoneContinent => {
			const [ continent, countries ] = timezoneContinent;

			return [ {
				value: 'label-' + continent,
				label: continent,
				isLabel: true,
			} ].concat(
				map( countries, ( timezone, index ) => {
					const [ value, label ] = timezone;
					return { value, label };
				} )
			);
		} );
	}

	getManualUtcOffsets() {
		const { rawOffsets, selectedZone, translate } = this.props;

		return [ {
			value: 'label-manual',
			label: translate( 'Manual Offsets' ),
			isLabel: true,
		} ].concat(
			map( this.props.rawOffsets, ( label, value ) => ( { label, value } ) )
		);
	}

	render() {
		const { includeManualOffsets, selectedZone, selectedZoneLabel } = this.props;

		let options = this.getTimezonesByContinent().concat( [
			{ value: 'label-UTC', label: 'UTC', isLabel: true },
			{ value: 'UTC', label: 'UTC' },
		] );
		if ( this.props.includeManualOffsets ) {
			options = options.concat( this.getManualUtcOffsets() );
		}

		return (
			<React.Fragment>
				<QueryTimezones />
				<SelectDropdown
					className='timezone-selector'
					onSelect={ this.onSelect }
					options={ options }
					value={ selectedZone || '' }
					selectedText={ selectedZoneLabel || selectedZone || '' }
				/>
			</React.Fragment>
		);
	}
}

Timezone.defaultProps = {
	onSelect: noop,
	includeManualOffsets: true,
};

Timezone.propTypes = {
	selectedZone: PropTypes.string,
	onSelect: PropTypes.func,
	includeManualOffsets: PropTypes.bool,
};

export default connect( ( state, ownProps ) => ( {
	rawOffsets: getRawOffsets( state ),
	timezones: getTimezones( state ),
	selectedZoneLabel: getTimezonesLabel( state, ownProps.selectedZone ),
} ) )( localize( Timezone ) );
