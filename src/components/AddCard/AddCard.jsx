import { ClickableTile } from 'carbon-components-react';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { g10 } from '@carbon/themes';
import Add from '@carbon/icons-react/es/add/20';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /** Title to show on the card */
  title: PropTypes.string.isRequired,
  /** Callback function when icon is clicked */
  onClick: PropTypes.func.isRequired,
};

/**
 * Clickable card that shows "Add" button
 */
const AddCard = ({ onClick, title, className }) => (
  <ClickableTile className={classNames(`${iotPrefix}-add-card`, className)} handleClick={onClick}>
    <p className={`${iotPrefix}-addcard-title`}>{title}</p>
    <Add fill={g10.icon01} description={title} />
  </ClickableTile>
);

AddCard.propTypes = propTypes;

export default AddCard;
