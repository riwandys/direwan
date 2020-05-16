import React, { useState, Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const EditProfile = ({profile: {profile, loading}, createProfile, getCurrentProfile, history}) => {
    const [formData, setFormData] = useState({
        location : '',
        website : '',
        bio : '',
        skills : '',
        status : '',
        githubusername : '',
        youtube : '',
        twitter : '',
        instagram : '',
        linkedin : '',
        facebook : '',
    });

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    useEffect(() => {
        getCurrentProfile();
        
        setFormData({
            location : loading || !profile.location ? '' : profile.location,
            website : loading || !profile.website ? '' : profile.website,
            bio : loading || !profile.bio ? '' : profile.bio,
            skills : loading || !profile.skills ? '' : profile.skills.join(','),
            status : loading || !profile.status ? '' : profile.status,
            githubusername : loading || !profile.githubusername ? '' : profile.githubusername,
            youtube : loading || !profile.social.youtube ? '' : profile.social.youtube,
            twitter : loading || !profile.social.twitter ? '' : profile.social.twitter,
            instagram : loading || !profile.social.instagram ? '' : profile.social.instagram,
            linkedin : loading || !profile.social.linkedin ? '' : profile.social.linkedin,
            facebook : loading || !profile.social.facebook ? '' : profile.social.facebook
        });
    }, [loading]);

    const {
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
      } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history, true);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Create Your Profile
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i> Let's get some information to make your
                profile stand out
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <select name="status" value={status} onChange={ e => onChange(e)} >
                        <option value="0">* Pilih status anda</option>
                        <option value="Mahasiswa">Dosen</option>
                        <option value="Dosen">Mahasiswa</option>
                    </select>
                    <small className="form-text">Posisi anda saat ini</small>
                </div>
                    <div className="form-group">
                    <input type="text" placeholder="Website" name="website" value={website} onChange={ e => onChange(e)}/>
                    <small className="form-text">Website pribadi</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Lokasi" name="location" value={location} onChange={ e => onChange(e)}/>
                    <small className="form-text">Kota anda saat ini</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Keahlian" name="skills" value={skills} onChange={ e => onChange(e)}/>
                    <small className="form-text">Gunakan tanda koma sebagai pemisah (contoh: HTML,CSS,JavaScript,PHP)</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Github Username" name="githubusername" value={githubusername} onChange={ e => onChange(e)}/>
                    <small className="form-text">Masukkan username GitHub anda</small>
                </div>
                <div className="form-group">
                    <textarea placeholder="Bio singkat" name="bio" value={bio} onChange={ e => onChange(e)}></textarea>
                    <small className="form-text">Ceritakan tentang diri anda</small>
                </div>

                <div className="my-2">
                <button onClick={() => toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-light">
                    Tambah Link Sosial Media
                </button>
                <span>Opsional</span>
                </div>

                {displaySocialInputs && (
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x"></i>
                            <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={ e => onChange(e)}/>
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x"></i>
                            <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={ e => onChange(e)}/>
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-youtube fa-2x"></i>
                            <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={ e => onChange(e)}/>
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-linkedin fa-2x"></i>
                            <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={ e => onChange(e)}/>
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x"></i>
                            <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={ e => onChange(e)}/>
                        </div>
                    </Fragment>
                )};

                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to='/dashboard'>Kembali</Link>
            </form>
        </Fragment>
    );
};

EditProfile.propTypes = {
    createProfile : PropTypes.func.isRequired,
    getCurrentProfile : PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(
    mapStateToProps, 
    { createProfile, getCurrentProfile }
) (withRouter(EditProfile));
