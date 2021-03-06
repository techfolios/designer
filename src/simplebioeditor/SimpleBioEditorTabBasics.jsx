import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { _ } from 'underscore';
import { Grid } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import LongTextField from 'uniforms-semantic/LongTextField';
import { writeBioFile } from './BioFileIO';

export default class SimpleBioEditorTabBasics extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);


    this.state = { model: {} };

    // Build a empty bio if one doesn't exist to input defaults for the bio
    this.state.tempbio = {};
    this.insertDefaults();

    this.state.model.name = '';
    this.state.model.label = '';
    this.state.model.picture = '';
    this.state.model.email = '';
    this.state.model.phone = '';
    this.state.model.website = '';
    this.state.model.summary = '';
    this.state.model.address = '';
    this.state.model.postalCode = '';
    this.state.model.city = '';
    this.state.model.region = '';
    this.state.model.countryCode = '';

    if (this.props.bio.basics !== undefined) {
      if (this.props.bio.basics.name !== undefined) this.state.model.name = this.props.bio.basics.name;
      if (this.props.bio.basics.label !== undefined) this.state.model.label = this.props.bio.basics.label;
      if (this.props.bio.basics.picture !== undefined) this.state.model.picture = this.props.bio.basics.picture;
      if (this.props.bio.basics.email !== undefined) this.state.model.email = this.props.bio.basics.email;
      if (this.props.bio.basics.phone !== undefined) this.state.model.phone = this.props.bio.basics.phone;
      if (this.props.bio.basics.website !== undefined) this.state.model.website = this.props.bio.basics.website;
      if (this.props.bio.basics.summary !== undefined) this.state.model.summary = this.props.bio.basics.summary;
      if (this.props.bio.basics.location !== undefined) {
        if (this.props.bio.basics.location.address !== undefined) {
          this.state.model.address = this.props.bio.basics.location.address;
        }
        if (this.props.bio.basics.location.postalCode !== undefined) {
          this.state.model.postalCode = this.props.bio.basics.location.postalCode;
        }
        if (this.props.bio.basics.location.city !== undefined) {
          this.state.model.city = this.props.bio.basics.location.city;
        }
        if (this.props.bio.basics.location.region !== undefined) {
          this.state.model.region = this.props.bio.basics.location.region;
        }
        if (this.props.bio.basics.location.countryCode !== undefined) {
          this.state.model.countryCode = this.props.bio.basics.location.countryCode;
        }
      }
    }
  }

  insertDefaults() {
    if (this.props.bio !== undefined) this.state.tempbio = this.props.bio;
    let needToWriteChange = false;
    if (this.state.tempbio.basics === undefined || Object.keys(this.state.tempbio.basics).length !== 9 ||
      Object.keys(this.state.tempbio.basics.location).length !== 5) {
      needToWriteChange = true;
    }
    const defaultBasics =
      {
        name: '',
        label: '',
        picture: '',
        email: '',
        phone: '',
        website: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          region: '',
          countryCode: '' },
        profiles: [],
      };

    this.state.tempbio.basics = _.defaults(this.state.tempbio.basics, defaultBasics);

    const defaultLocation = { address: '', postalCode: '', city: '', region: '', countryCode: '' };

    this.state.tempbio.basics.location = _.defaults(this.state.tempbio.basics.location, defaultLocation);

    if (needToWriteChange) {
      writeBioFile(this.props.directory, this.state.tempbio, 'Automatically inserted Basics field items to your JSON');
      this.props.handleBioChange(this.state.tempbio);
    }
  }

  submit(data) {
    const
      { name, label, picture, email, phone, website, summary, address, postalCode, city, countryCode, region } = data;
    const bio = this.props.bio;
    const tempProfiles = bio.basics.profiles; // This should remain the same so it is temporarily saved
    bio.basics = {};
    bio.basics.name = name || '';
    bio.basics.label = label || '';
    bio.basics.picture = picture || '';
    bio.basics.email = email || '';
    bio.basics.website = website || '';
    bio.basics.summary = summary || '';
    bio.basics.phone = phone;
    bio.basics.location = {};
    bio.basics.location.address = address;
    bio.basics.location.postalCode = postalCode;
    bio.basics.location.city = city;
    bio.basics.location.region = region;
    bio.basics.location.countryCode = countryCode;
    bio.basics.profiles = tempProfiles;
    writeBioFile(this.props.directory, bio, 'Updated basics section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      name: String,
      label: String,
      picture: String,
      email: String,
      phone: { type: String, optional: true },
      website: String,
      summary: String,
      address: { type: String, optional: true },
      postalCode: { type: String, optional: true, label: 'Zip Code' },
      city: { type: String, optional: true },
      region: { type: String, optional: true, label: 'State' },
      countryCode: { type: String, optional: true, label: 'Country' },
    });
    this.constructor(this.props);
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="name" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="label" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="email" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <AutoField name="picture" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="website" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <LongTextField name="summary" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={3}>
                <AutoField name="phone" />
              </Grid.Column>
              <Grid.Column width={4}>
                <AutoField name="address" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="city" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="region" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="postalCode" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="countryCode" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <SubmitField value="Save" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ErrorsField />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </AutoForm>
      </div>
    );
  }
}

SimpleBioEditorTabBasics.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
