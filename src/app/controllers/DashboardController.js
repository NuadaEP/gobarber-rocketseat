const { User, Appointment } = require('../models')
const { Op, sequelize } = require('sequelize')
const moment = require('moment')

class DashboardController {
  async index (req, res) {
    var providers = await User.findAll({ where: { provider: true } })

    if (req.session.user.provider) {
      // providers = await User.findAll({ where: { provider: false } })
      var providers = await Appointment.findAll({
        include: [{ model: User, as: 'user' }],
        where: {
          provider_id: req.session.user.id,
          date: {
            [Op.between]: [
              moment()
                .startOf('day')
                .format(),
              moment()
                .endOf('day')
                .format()
            ]
          }
        }
      })

      providers = providers.map(provider => {
        return {
          avatar: provider.user.avatar,
          name: provider.user.name,
          date: moment(provider.date).format('HH:mm'),
          disabled: moment().isAfter(moment(provider.date))
        }
      })
    }

    // return res.send(
    //   providers.map(provider => {
    //     return provider
    //   })
    // )
    return res.render('dashboard', { providers })
  }
}

module.exports = new DashboardController()
