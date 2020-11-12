// @flow
import React, {type Node as ReactNode} from "react";
import {Divider, ListItem, ListItemText, Checkbox} from "@material-ui/core";
import {type Identity, type IdentityId} from "../../core/identity";

type IdentityListItemsProps = {
  +identities: $ReadOnlyArray<Identity>,
  +onClick: Function,
  +isCheckedHash: Map<IdentityId, boolean>,
  +onCheckbox: Function,
};

export const IdentityListItems = ({
  identities,
  onClick,
  isCheckedHash,
  onCheckbox,
}: IdentityListItemsProps): ReactNode => {
  const lastIndex = identities.length - 1;

  if (lastIndex > -1) {
    return identities.map((identity, index) => (
      <React.Fragment key={identity.id}>
        <ListItem button onClick={() => onClick(identity)}>
          <ListItemText primary={identity.name} />
          <Checkbox
            onChange={(e) => onCheckbox(identity.id, e)}
            checked={Boolean(isCheckedHash.get(identity.id))}
            name="active"
            color="primary"
          />
        </ListItem>
        {index < lastIndex && <Divider />}
      </React.Fragment>
    ));
  } else {
    return (
      <ListItem button key="no_results">
        <em>No results</em>
      </ListItem>
    );
  }
};
